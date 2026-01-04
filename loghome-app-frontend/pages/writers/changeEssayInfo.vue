<template>
	<div class="outer">
		<log-image class="cover" :src="imgSrc" alt="" @click="changeCover"/>
		<el-input
		  type="text"
		  placeholder="作品名"
		  v-model="title"
		  maxlength="15"
		  show-word-limit
		>
		</el-input>
		<div style="margin: 20rpx 0;"></div>
		<el-input
		  type="textarea"
		  placeholder="作品介绍"
		  v-model="content"
		  :rows="4"
		  :autosize="{ minRows: 4}"
		  maxlength="300"
		  show-word-limit
		>
		</el-input>
		<div class="button" @click="submit">提交</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default{
		data() {
			return{
				title:"",
				content:"",
				imgSrc:"",
				buttonLock : true,
				id:0
			}
		},

		onLoad(params){
			this.id = params.id;
		},
		onShow(){
			this.refreshPage();
		},
		methods:{
			refreshPage(){
				axios.get(this.$baseUrl + '/essays/get_novel_by_id?id=' + this.id, {}).then((res) => {
					this.title = res.data[0].name;
					this.content = res.data[0].content;
					this.id = res.data[0].novel_id;
					this.imgSrc = res.data[0].picUrl;
					console.log(res.data[0]);
					uni.setNavigationBarTitle({
						title: "修改作品信息"
					});
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {})
			},
			submit(){
				if(this.title.replace(/(^\s*)|(\s*$)/g, "") == "" || this.content.replace(/(^\s*)|(\s*$)/g, "") == "") return;
				if(!this.buttonLock) return;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				this.buttonLock = false;
				axios.post(this.$baseUrl + '/essays/modify_novel',
						{
							name:this.title,
							content:this.content,
							novel_id:this.id
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
							title: "作品信息修改成功",
							icon: 'none',
							duration: 2000
						});
						setTimeout(()=>{
							uni.reLaunch({
								url: '../essays',
							})
						},2000)
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
								title: "作品信息修改失败",
								icon: 'none',
								duration: 2000
							});
						}
					})
					.then(function(){
						_this.buttonLock = true;
					});
			},
			changeCover(){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['上传封面', '封面制作器'],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							uni.navigateTo({
								url:"./cover_upload??noneAnimation=true&id=" + _this.id
							})
						}
						if(res.tapIndex == 1) {
							let url = "https://m.loghome.ink/subtasks/cover-maker.html?novelid=" + _this.id;
							uni.navigateTo({
								url:`../apps/h5webview?url=${encodeURIComponent(url)}&title=封面制作器`
							})
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			}
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
		.cover{
			width:200rpx;
			margin-bottom:50rpx;
			border-radius: 10rpx;
		}
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
			height: 300px;
			line-height: 37px;
			border: 0px;
			color: #333333;
			font-size: 16px;
			background-color: #ffffff;
			padding-left:10px;
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
		background-color: #b46f58;
		text-align: center;
	}
	
	.button:active {
		background-color: rgb(234, 171, 11);
	}

</style>
