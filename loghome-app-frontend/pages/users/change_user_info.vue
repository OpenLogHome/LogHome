<template>
	<div class="outer">
		<view class="avator">
			<log-image :src="user.avatar_url" @click="gotoAvater"
			onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
		</view>
		<el-input
		  type="text"
		  placeholder="笔名"
		  v-model="username"
		  maxlength="20"
		  show-word-limit
		>
		</el-input>
		<div style="margin: 20rpx 0;"></div>
		<el-input
		  type="textarea"
		  placeholder="个性签名"
		  v-model="motto"
		  :rows="4"
		  :autosize="{ minRows: 4}"
		  maxlength="30"
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
				username:"",
				motto:"",
				user:{},
				buttonLock : true,
				id:0
			}
		},
		onShow() {
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			if(tk == null){
				uni.navigateTo({
					url: './users/login?msg=' + 'unAuthorized'
				});
				return;
			}
			//验活
			axios.get( this.$baseUrl + '/users/userprofile', {
				headers: { 
				     'Content-Type': 'application/json',
				     'Authorization': tk 
				}
			}).then((res) => {
				_this.user = JSON.parse(JSON.stringify(res.data));
				_this.username = _this.user.name;
				_this.motto = _this.user.motto;
			}).catch(function(error) {
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './login'
					});
				}
			})
		},
		methods:{
			gotoAvater(){
				uni.navigateTo({
					url:"./avater_upload?noneAnimation=true&url=" + this.user.avatar_url
				})
			},
			submit(){
				if(this.username.replace(/(^\s*)|(\s*$)/g, "") == "" || this.motto.replace(/(^\s*)|(\s*$)/g, "") == "") 
				{
					uni.showToast({
						title: "必填项未填",
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if(!this.buttonLock) return;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				this.buttonLock = false;
				axios.post(this.$baseUrl + '/users/update_userinfo',
						{
							name:this.username,
							motto:this.motto
						},
						{
							headers: {
								'Content-Type': 'application/json', 
								'Authorization': 'Bearer ' + tk 
							}
						},
					)
					.then(function(response) {
						uni.showToast({
							title: "修改成功",
							icon: 'none',
							duration: 2000
						});
						setTimeout(()=>{
							uni.reLaunch({
								url: '../me',
							})
						},2000)
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
								title: "修改失败",
								icon: 'none',
								duration: 2000
							});
						}
					})
					.then(function(){
						_this.buttonLock = true;
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
		.avator{
			margin-top:10rpx;
			margin-bottom:70rpx;
			width: 160upx;
			height: 160upx;
			background: #fff;
			border: 5upx solid #fff;
			border-radius: 8rpx;
			overflow: hidden;
			img{
				width: 100%;
				height: 100%;
			}
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
			height: 100px;
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
		background-color: rgb(180, 111, 88);
		text-align: center;
	}
	
	.button:active {
		background-color: rgb(225, 139, 110);
	}

</style>
