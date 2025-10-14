<template>
	<div class="outer">
		<div class="content">
			<img class="logo" src="/static/logo.png"></img>
			<view class="text-area">
				<div class="title">原木通信证登录</div>
				<div class="version" v-show="$store.state.appVersion">APP版本：{{this.$store.state.appVersion}}</div>
			</view>
			<div class="longin-boder">
				<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon" /></div>
				<input class="input" type="text" placeholder="请输入账号/手机号/QQ" v-model="account"/>
			</div> 
			<!--End用户名输入框-->
			<div class="longin-boder">
				<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon" /></div>
				<input class="input" type="password" placeholder="请输入密码" v-model="pwd"/>
			</div>
			<!--End密码输入框-->
			<div class="button" @click="login">登录</div>
			<label style="margin-left:50vw; transform:translateX(-50%); 
			display: flex;flex-direction: row;font-size: 28upx; margin-top: 50rpx;
			width:80vw">
				<checkbox-group  @change="selectCk">
					<checkbox value="yes" color="rgb(180, 111, 88)"/>
				</checkbox-group>
				<span style="display: flex;flex-direction: row;">我已经阅读并接受
					<navigator url="../static/privacyAgreement" open-type="navigate" style="color: #FF6000;border-bottom: 1px solid  #FF6000;">原木社区用户隐私政策
					</navigator>
				</span>
			</label>
			
			<div class="button-small" @click="forgotten">忘记密码</div>
			<div class="button-small" @click="register">注册账号</div>
			
			
			<div class="certification" style="padding-top: 200rpx;">
				<a href="https://www.12377.cn/" target="_blank" style="
				                        background-color:#fff;
				                        display: inline-block;
				                        padding: 5px 8px;
				                        border: 1px solid #eee;
				                        border-radius: 5px;
				                        margin: 5px 0;
										text-decoration:none;
										color:#939393;
										vertical-align: middle;
										font-size: 30rpx;
				                    "><log-image src="https://dn-tystatic.qbox.me/img/buliang.png" style="
				                        margin-right: 5px;
				                        width: 35rpx;
				                        height: 35rpx;" />网上有害信息举报专区</a>
				
				<div style="font-size:30rpx;text-decoration:none;height:20px;line-height:20px;color:#939393;
				margin-bottom:10rpx;">
					<a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index"
					style="font-size:30rpx;text-decoration:none;height:20px;line-height:20px;color:#939393;
					margin-bottom:10rpx;">
						<p>苏ICP备2021006745号-1</p>
					</a>
					
				</div>
				<img src="../../static/batb.png" alt="" />
				<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34010402703554" style="font-size:30rpx;display:inline-block;text-decoration:none;height:20px;line-height:20px;"><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">皖公网安备 34010402703554号</p></a>
			</div>
			
			<div class="back">
				<img src="../../static/about_bg.jpg" alt="" />
			</div>
		</div>
		</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				title: '原木社区',
				version:"Alpha 0.1.1",
				account:"",
				pwd:"",
				checked:false
			}
		},
		onLoad(params) {
			if(params.msg != undefined) {
				uni.showToast({
					title: "请先登录",
					icon:'none',
					duration: 2000
				});
			}
			// this.$alert("旧版登录通道即将在7月30日关闭，为了保证你的正常使用，请还未绑定手机号的用户尽快前往设置=>账号绑定进行手机号绑定，谢谢。")
		},
		onBackPress(e) {
			// uni.switchTab({
			// 	url: '../library'
			// });	
			// return true;
		},
		methods: {
			login(){
				if(!this.checked){
					uni.showToast({
						title: "请先阅读并接受《原木社区用户隐私政策》",
						icon: 'none',
						duration: 2000
					});
					return;
				}
				axios.post(this.$baseUrl + '/users/login', {
				    username: this.account,
				    password: this.pwd,
					is_hypernotion: this.$store.state.hypernotion
				  })
				  .then(function (response) {
				    window.localStorage.setItem('token', JSON.stringify(response.data.token));
					uni.reLaunch({
						url:'../me'
					})
				  })
				  .catch(function (error) {
					  //console.log(error);
					  if(error) {
						  uni.showToast({
							title: "账号或密码错误",
							icon:'none',
							duration: 2000
						  });
					  }
				    
				  });
			},
			register(){
				uni.navigateTo({
					url:"./login_page_email"
				})
			},
			selectCk(e){
				if(e.detail.value.length != 0){
					this.checked = true;
				}else {
					this.checked = false;
				}
			},
			forgotten(){
				uni.navigateTo({
					url:"./forgottenPwd"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.outer{
		height:100%;
		position:relative;
		background-color: #FCF3E0;
	}
	
	.content{
		width: 100%;
		padding-top: 30%;
		position:absolute;
		width:100vw;
		padding-bottom: 50rpx;
		z-index: 1;
		text-align: center;
	}
	
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
	
	.text-area {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.title {
		font-size: 50rpx;
		font-weight: bold;
		color: #8f8f94;
	}
	
	.version {
		font-size: 35rpx;
		color: #8f8f94;
	}
	
	.longin-boder{
		width: 80%;
		height: 40px;
		margin-top: 20px;
		margin-left: 10%;
		line-height: 40px;
		text-align: center;
		border: 1px solid #dddddd;
		border-radius: 5px;  
		background-color: #efefef;
	}
	img.icon{
		width:70rpx;
	}
	.image{
		width: 50rpx;
		float: left;
		text-align: right;
	}
	.input{
		width: 80%;
		float: left;
		margin-left: 5%;
		height: 37px;
		line-height: 37px;
		border:0px;
		color: #333333;
		font-size: 16px;
		background-color: #efefef;
		
	}
	 
	.button{
		height: 40px;
		width: 80%;
		margin-top: 20px;
		margin-left: 10%;
		font-size: 16px;
		
		font-weight: bold;
		line-height: 38px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(180, 111, 88);
		
	}
	 
	.button:active {  
		background-color:rgb(225, 139, 110);
	}
	
	 
	div.back{
		position:absolute;
		z-index: -1;
		bottom:0;
	}
	
	
	.button-small {
		height: 20px;
		width: 100%;
		margin-top: 15px;
		font-size: 16px;
		
		font-weight: bold;
		text-align: center;
		line-height: 38px;
		border-radius: 5px;
		color: rgb(180, 111, 88);
	
	}
</style>
