<template>
	<div class="outer">
		<el-input
		  type="text"
		  placeholder="小说名"
		  v-model="title"
		  maxlength="15"
		  show-word-limit
		>
		</el-input>
		<div style="margin: 20rpx 0;"></div>
		<el-input
		  type="textarea"
		  placeholder="小说介绍"
		  v-model="content"
		  :rows="4"
		  :autosize="{ minRows: 4}"
		  maxlength="300"
		  show-word-limit
		>
		</el-input>
		<div style="margin: 20rpx 0;"></div>
		<el-select v-model="tags" multiple placeholder="选择参加社区创作活动" style="width:100%;">
			<el-option
			  v-for="tag in suggested_tags"
			  :key="tag.tag_id"
			  :label="tag.tag_name"
			  :value="tag.tag_name">
			</el-option>
		</el-select>
		<label style="display: flex;flex-direction: row;font-size: 28upx; margin-top: 50rpx;">
			<checkbox-group  @change="selectCk">
				<checkbox value="yes" color="rgb(234, 112, 52)"/>
			</checkbox-group>
			<span style="display: flex;flex-direction: row;">我已经阅读并接受
				<navigator url="../static/contentAgreement" open-type="navigate" style="color: #FF6000;border-bottom: 1px solid  #FF6000;">原木社区用户内容上传协议
				</navigator>
			</span>
		</label>
		<div class="button" @click="submit">创建小说</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default{
		data() {
			return{
				title:"",
				content:"",
				buttonLock: true,
				checked:false,
				tags: [],
				suggested_tags: []
			}
		},
		methods:{
			submit(){
				if(!this.checked){
					uni.showToast({
						title: "请先阅读并接受《原木社区用户内容上传协议》",
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if(this.title.replace(/(^\s*)|(\s*$)/g, "") == "" || this.content.replace(/(^\s*)|(\s*$)/g, "") == "") return;
				if(!this.buttonLock) return;
				let _this=this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				this.buttonLock = false;
				axios.post(this.$baseUrl + '/essays/add_Novel',
						{
							name:this.title,
							content:this.content,
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
							title: "小说创建成功",
							icon: 'none',
							duration: 2000
						});
						setTimeout(()=>{
							uni.reLaunch({
								url: '../essays',
							})
						},2000)
						if(_this.tags.length > 0){
							for(let item of _this.tags){
								_this.addTag(response.data.insertId,item);
							}
						}
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
								title: "小说创建失败",
								icon: 'none',
								duration: 2000
							});
						}
					})
					.then(function(){
						_this.buttonLock = true;
					});
			},
			addTag(novel_id,tag){
				let _this = this;
				if(tag.replace(/(^\s*)|(\s*$)/g, "") == "" || tag.replace(/(^\s*)|(\s*$)/g, "") == "") return;
				var reg = new RegExp( '[ \n]' , "g" )
				let tag_name = tag.replace(reg, "");
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(tk) tk = tk.tk;
				axios.get(_this.$baseUrl + '/library/add_novel_tag?novel_id=' + novel_id + "&tag_name=" + tag_name,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
				}).catch(function (error) {
					uni.showToast({
						title: error.response.data.msg,
						icon:'none',
						duration: 2000
					});
				}).then(function(){})
			},
			getSuggestedTags(){
				let _this = this;
				axios.get(_this.$baseUrl + '/library/get_suggested_tags?novel_id=' + this.novel_id, {}).then((res) => {
					_this.suggested_tags = res.data;
					for(let i = 0 ; i < _this.suggested_tags.length ; i ++){
						if(!_this.suggested_tags[i].is_activity_tag) {
							_this.suggested_tags.splice(i,1);
							i --;
						}
					}
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){})
			},
			selectCk(e){
				if(e.detail.value.length != 0){
					this.checked = true;
				}else {
					this.checked = false;
				}
			}
		},
		onLoad(){
			this.getSuggestedTags();
		}
	}
</script>

<style scoped lang="less">
	.outer{
		display:flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		margin:30px;
		.input {
			width: 100%;
			height: 37px;
			line-height: 37px;
			border: 0px;
			color: #333333;
			font-size: 16px;
			background-color: #ffffff;
			margin-bottom: 20px;
			border-radius: 5px;
			padding-left:10px;
		}
		.textarea{
			width: 100%;
			height: 150px;
			line-height: 37px;
			border: 0px;
			color: #333333;
			font-size: 16px;
			background-color: #ffffff;
			padding-left:10px;
		}
		
		.title_bar{
			padding: 8px 30rpx;
			font-size: 40rpx;
			font-weight: bold;
			background-color: #f2f2f2;
			margin: 25rpx auto;
			color: #934900;
		}
		
		.suggested_tags{
			display:flex;
			flex-wrap: wrap;
			height:auto;
			min-height:100rpx;
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
	}
	
	.button {
		height: 40px;
		width: 80%;
		margin-top: 30px;
		font-size: 16px;
		
		font-weight: bold;
		line-height: 38px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(234, 112, 52);
		text-align: center;
	}
	
	.button:active {
		background-color: rgb(234, 171, 11);
	}

</style>
