<template>
	<view v-dark>
		<view class="list-content">
			<view class="list">
				<view class="li " @click="setPersonalBtn">
					<view class="text">作品状态：{{novel.is_personal==0?"公开":"私密"}}</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
				<view class="li " @click="setUpdateBtn">
					<view class="text">更新状态：{{novel.is_complete==0?"连载":"完结"}}</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
				<view class="li high" @click="gotoChangeNovelTags">
					<view class="text">作品标签：
						<div class="tag" v-for="(item,index) in tags" :key="item.tag_id" :class="{'activity':item.is_activity_tag}">
							{{item.tag_name}}
						</div>
						<div class="nontag" v-show="tags.length == 0">无</div>
					</view>
				</view>
				<view class="li " @click="gotoChangeBookInfo">
					<view class="text">修改作品信息</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
<!-- 				<view class="li " @click="gotoChangeNovelPic">
					<view class="text">编辑作品图册</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view> -->
			</view>
			<view class="list">
				<view class="li noborder" @click="deleteEssay">
					<view class="text" style="color:red">删除作品</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import axios from 'axios'
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default {
		data() {
			return {
				id:-1,
				novel:{},
				tags:[]
			}
		},
		mixins: [darkModeMixin],
		onLoad(params) {
			this.id = params.id;
			this.refreshPage();
		},
		onShow(){
			this.refreshPage();
		},
		methods: {
			refreshPage(){
				this.getNovelTags();
				axios.get(this.$baseUrl + '/essays/get_novel_by_id?id=' + this.id, {}).then((res) => {
					this.novel = res.data[0];
					console.log(this.novel);
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {})
			},
			gotoChangeBookInfo(){
				uni.navigateTo({
					url:"./changeEssayInfo?id=" + this.id
				})
			},
			deleteEssay(){
				let id = this.id;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '删除后将无法找回，确定继续吗？\n（删除作品将消耗50原木）',
					confirmColor:"#F00",
					success: function (res) {
						if (res.confirm) {
							axios.post(_this.$baseUrl + '/essays/delete_novel',
								{
									id:id
								},
								{
									headers: {
										'Content-Type': 'application/json', //设置请求头请求格式为JSON
										'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
									}
								},
							)
							.then(function(response) {
								uni.showToast({
									title: "已删除小说",
									icon: 'none',
									duration: 2000
								});
								uni.reLaunch({
									url:"/pages/essays"
								})
							})
							.catch(function(error) {
								//console.log(error);
								if (error) {
									uni.showToast({
										title: "小说删除失败",
										icon: 'none',
										duration: 2000
									});
								}
							})
							.then(function(){
								_this.buttonLock = true;
							});
						} else if (res.cancel) {
							return;
						}
					}
				});
			},
			setPersonal(is_personal){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				axios.post(this.$baseUrl + '/essays/set_novel_status',
						{
							is_personal:is_personal,
							novel_id:_this.id
						},
						{
							headers: {
								'Content-Type': 'application/json', //设置请求头请求格式为JSON
								'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
							}
						},
					)
					.then(function(response) {
						if(response.data.msg){
							uni.showToast({
								title: response.data.msg,
								icon: 'none',
								duration: 2000
							});
						}
						_this.refreshPage();
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
								title: "小说状态修改失败",
								icon: 'none',
								duration: 2000
							});
						}
					})
					.then(function(){
						_this.buttonLock = true;
					});
			},
			setUpdate(is_complete){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				axios.post(this.$baseUrl + '/essays/set_novel_update_status',
						{
							is_complete:is_complete,
							novel_id:_this.id
						},
						{
							headers: {
								'Content-Type': 'application/json', //设置请求头请求格式为JSON
								'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
							}
						},
					)
					.then(function(response) {
						if(response.data.msg){
							uni.showToast({
								title: response.data.msg,
								icon: 'none',
								duration: 2000
							});
						}
						_this.refreshPage();
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
								title: "小说状态修改失败",
								icon: 'none',
								duration: 2000
							});
						}
					})
					.then(function(){
						_this.buttonLock = true;
					});
			},
			setPersonalBtn(){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['公开',"私密"],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							_this.setPersonal(0);
						}
						if(res.tapIndex == 1) {
							_this.setPersonal(1);
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			getNovelTags(){
				let _this = this;
				axios.get(_this.$baseUrl + '/library/get_novel_tags?novel_id=' + this.id, {}).then((res) => {
					_this.tags = res.data;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
				})
			},
			setUpdateBtn(){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['连载',"完结"],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							_this.setUpdate(0);
						}
						if(res.tapIndex == 1) {
							_this.setUpdate(1);
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			gotoChangeNovelPic(){
				
			},
			gotoChangeNovelTags(){
				uni.navigateTo({
					url:"./changeNovelTags?id=" + this.novel.novel_id
				})
			}
		}
	}
</script>

<style scoped lang="scss">

.text{
	font-size: 30rpx;
	width: 100%;
	
	.dark-mode & {
		color: var(--text-color-primary);
	}
}		

page{
	background-color:rgb(255, 248, 234);
	font-size: 30upx;
	
	&.dark-mode {
		background-color: var(--background-color-secondary);
	}
}
.list-content{
	background: #fff;
	margin-top:20upx;
	
	.dark-mode & {
		background: var(--card-background);
	}
}
.list{
	width:100%;
	border-bottom:15upx solid #f2f2f2;
	background: #fff;
	
	.dark-mode & {
		background: var(--card-background);
		border-bottom:15upx solid var(--border-color);
	}
	
	&:last-child{
		border: none;
	}
	.li{
		width:92%;
		height:100upx;
		padding:0 4%;
		border-bottom:1px solid rgb(255, 248, 234);
		display:flex;
		align-items:center;
		
		.dark-mode & {
			border-bottom:1px solid var(--border-color);
		}
		
		&.noborder{
			border-bottom:0
		}
		.icon{
			flex-shrink:0;
			width:50upx;
			height:50upx;
			img{
				width:50upx;
				height:50upx;
			}
		}
		.text{
			display: flex;
			flex-wrap: wrap;
			padding-left:20upx;
			width:100%;
			color:#666;
			
			.dark-mode & {
				color: var(--text-color-regular);
			}
		}
		.to{
			flex-shrink:0;
			width:40upx;
			height:40upx;
		}
	}
	.li.high{
		height:auto;
		min-height:100upx;
	}
	.li{
		.tag{
			background-color: #eeeeee;
			height:55upx;
			line-height: 55upx;
			padding:0 10upx;
			border-radius: 10upx;
			margin-right: 10upx;
			
			.dark-mode & {
				background-color: var(--background-color-secondary);
			}
		}
		.tag.activity{
			color:#ec8600;
			background-color: #ffcfa5;
			
			.dark-mode & {
				background-color: rgba(236, 134, 0, 0.2);
			}
		}
	}
}
</style>
