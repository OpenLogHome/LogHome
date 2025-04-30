<template>
	<view class="outer">
		<div class="step0" v-if="step == 0">
			<p>仅支持已注册手机号登录</p>
			<div class="longin-boder">
				<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon" /></div>
				<input class="input" type="text" placeholder="请输入中国大陆手机号" v-model="mobile"/>
			</div> 
			<div class="button" @click="nextStep()">下一步</div>
		</div>
		<transition name="slide-fade" mode="out-in">
			<div class="step step1" v-if="step == 1">
				<p>我们非常抱歉地告知您，由于工信部政策调整，原木社区现已不支持新手机号注册，请尽快迁移至邮箱登录。</p>
				<p>如果您需要找回账号，请通过原木社区开源计划交流群联系我们：701928273。</p>
				<div class="button cancel" @click="step = 0">上一步</div>
			</div>
		</transition>
		<transition name="slide-fade" mode="out-in">
			<div class="step step2" v-if="step == 2">
				<div class="lr">
					<div>
						<div>验证码已发送至：</div>
						<div>{{mobile}}</div>
					</div>
					<div class="btn" v-show="!isWaiting" @click="sendCode">重新发送</div>
					<div class="btn wait" v-show="isWaiting">等待{{waitTime}}秒</div>
				</div>
				<div class="longin-boder">
					<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon" /></div>
					<input class="input" type="text" placeholder="请输入验证码" v-model="verifyCode"/>
				</div>
				
				<div class="button" @click="nextStep()">下一步</div>
				<div class="button cancel nomargin" @click="step = 0">上一步</div>
			</div>
		</transition>
		<transition name="slide-fade" mode="out-in">
			<div class="step step3" v-if="step == 3">
				<p>欢迎来到原木社区，请设置你的账号和密码。</p>
				<div class="longin-boder" v-if="!forgetPwd">
					<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon" /></div>
					<input class="input" type="text" placeholder="请输入账号" v-model="account" @input="checkAccount"/>
				</div>
				<div class="warn" v-show="accountUsed && !forgetPwd">该账号已被使用</div>
				<div class="longin-boder">
					<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon" /></div>
					<input class="input" type="password" placeholder="请输入密码" v-model="pwd"/>
				</div>
				
				<div class="button" @click="nextStep()">下一步</div>
				<div class="button cancel nomargin" @click="step = 0;">上一步</div>
			</div>
		</transition>
		<transition name="slide-fade" mode="out-in">
			<div class="step step5" v-if="step == 5">
				<div class="lr">
					<div>
						<div>即将使用以下手机号登录：</div>
						<div>{{mobile}}</div>
					</div>
					<div class="btn" @click="forgetPwd=true;step = 1">忘记密码</div>
				</div>
				<div class="longin-boder">
					<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon" /></div>
					<input class="input" type="password" placeholder="请输入密码" v-model="pwd"/>
				</div>
				
				<div class="button" @click="nextStep()">登录</div>
				<div class="button cancel nomargin" @click="step = 0">上一步</div>
			</div>
		</transition>
	</view>
</template>

<script>
	import axios from 'axios'
	import moveVerify from '../../components/helang-moveVerify/helang-moveVerify.vue'
	export default{
		components:{
			moveVerify
		},
		data(){
			return{
				step:0,
				//0：待输入手机号 1：新用户注册，滑动验证码 2：填写验证码 3：新用户注册，填写账号和密码 5：老用户登录，填写密码
				account:"",
				mobile:"",
				pwd:"",
				verifyCode:"",
				verifyState:false,
				isWaiting:false,
				waitTime:60,
				waitTimer:undefined,
				accountUsed:false,
				registerVerify:"",
				forgetPwd:false
			}
		},
		methods:{
			checkAccount(){
				axios.get(this.$baseUrl + '/users/check_account?account=' + this.account, {}).then((res) => {
					if(res.data.length > 0){
						this.accountUsed = true;
					} else {
						this.accountUsed = false;
					}
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			verifyResult(res) {
				this.step = 2;
				this.sendCode();
			},
			nextStep(){
				switch(this.step){
					case 0:
						this.forgetPwd = false;
						if(!/^1[3-9]\d{9}$/.test(this.mobile)){
							uni.showToast({
								title: "请输入11位数字的中国大陆手机号",
								icon: 'none',
								duration: 2000
							});
							return;
						}
						uni.showLoading({
							
						})
						axios.get(this.$baseUrl + '/users/check_mobile?mobile=' + this.mobile, {}).then((res) => {
							if(res.data.length > 0){
								this.step = 5;
							} else {
								this.step = 1;
							}
						}).catch(function (error) {
							uni.showToast({
								title: error.toString(),
								icon:'none',
								duration: 2000
							});
						}).then(function(){
							uni.hideLoading();
						})
						break;
					case 2:
						axios.get(this.$baseUrl + '/users/register_with_mobile?mobile=' + this.mobile + "&vcode=" + 
						this.verifyCode, {}).then((res) => {
							if(res.data.msg == "登录成功")
							{
								this.registerVerify = res.data.register_code;
								this.step = 3;
							} else {
								uni.showToast({
									title:res.data.msg,
									icon: 'none',
									duration: 2000
								});
							}
						}).catch(function (error) {
							uni.showToast({
								title: error.toString(),
								icon:'none',
								duration: 2000
							});
						}).then(function(){
							uni.hideLoading();
						})
						break;
					case 3:
						this.register();
						break;
					case 5:
						this.login();
						break;
				}
			},
			sendCode() {
				let _this = this;
				if (this.resultData == false) {
					uni.showToast({
						title: "请滑动验证滑块",
						icon: 'error',
						duration: 2000
					});
					return;
				}
				var axios = require('axios');
				
				var config = {
				  method: 'get',
				  url: this.$baseUrl + '/users/send_mobile_verify_code?mobile=' + _this.mobile,
				  headers: { }
				};
				
				axios(config)
				.then(function (response) {
				  uni.showToast({
				  	title: response.data.msg,
					icon:'none',
				  	duration: 2000
				  });
				  _this.waitTime = 60;
				  _this.isWaiting = true;
				  _this.waitTimer = setInterval(()=>{
					  _this.waitTime --;
					  if(_this.waitTime == 0){
						   _this.isWaiting = false;
						   _this.waitTimer = undefined;
					  }
				  },1000)
				})
				.catch(function (error) {
				  console.log(error);
				});
			
			},
			submit(){
				uni.showLoading({
					title: '验证中'
				});
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				if(tk == null){
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
					return;
				}
				axios.get( this.$baseUrl + '/users/verify_mobile?mobile=' + this.mobile + "&vcode=" + this.vcode, {
					headers: { 
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					if(res.data.msg == "登录成功")
					{
						uni.showToast({
							title: "绑定成功",
							icon: 'none',
							duration: 2000
						});
						setTimeout(()=>{
							uni.switchTab({
								url: '../me',
							})
						},2000)
					} else {
						uni.showToast({
							title:res.data.msg,
							icon: 'none',
							duration: 2000
						});
					}
				}).catch(function(error) {
					console.log(JSON.stringify(error));
					uni.showToast({
						title: error,
						icon: 'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			login(){
				let _this = this;
				axios.post(this.$baseUrl + '/users/login', {
				    username: this.mobile,
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
						  _this.pwd = "";
					  }
				    
				  });
			},
			//校验密码：只能输入6-20个字母、数字、下划线
			isPasswd(s) {
				var patrn = /^(\w){6,20}$/;
				if (!patrn.exec(s)) return false
				return true
			},
			register() {
				if (this.pwd == "") {
					uni.showToast({
						title: "请输入密码",
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.isPasswd(this.pwd) != true) {
					uni.showToast({
						title: "密码格式：6-20位字母、数字、下划线组合",
						icon: 'error',
						duration: 2000
					});
					return;
				}
				//账号格式4-12位字母数字
				let accountPattern = /^[a-zA-Z0-9]{4,12}$/;
				//密码格式6-22位字母数字组合
				let passwordPattern = /^[a-zA-Z0-9]{6,22}$/;
				if(!accountPattern.test(this.account) && !this.forgetPwd){
					uni.showToast({
						title: "账号格式：4-12位字母、数字、下划线组合",
						icon:'none',
						duration: 2000
					});
					return;
				}
				axios.post(this.$baseUrl + '/users/register', {
				    username: this.account,
				    password: this.pwd,
					mobile: this.mobile,
					verifyCode: this.registerVerify
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
							title: "账号已被注册",
							icon:'none',
							duration: 2000
						  });
					  }
				    
				  });
			}
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		padding:80rpx 50rpx;
		font-size: 35rpx;
		div.lr{
			display:flex;
			justify-content: space-between;
			.btn{
				color:rgb(180, 111, 88);
			}
			.btn.wait{
				color:rgb(154, 154, 154);
			}
		}
		p{
			color:#3a3a3a;
			margin:0 0 50rpx 0;
		}
		.warn{
			color:rgb(255, 85, 0);
			margin-top:10rpx;
			text-align: right;
		}
		.longin-boder{
			width: 100%;
			height: 40px;
			margin-top: 20px;
			line-height: 40px;
			text-align: center;
			border: 1px solid #dddddd;
			border-radius: 5px;  
			background-color: #efefef;
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

		}
		.button{
			height: 40px;
			width: 100%;
			margin-top: 60rpx;
			font-size: 16px;
			text-align: center;
			font-weight: bold;
			line-height: 35px;
			border-radius: 5px;
			color: #ffffff;
			border:5rpx rgb(180, 111, 88) solid;
			box-sizing: border-box;
			background-color: rgb(180, 111, 88);
			
		}
		
		.button.cancel{
			background-color: rgba(234,112,52,0);
			color: rgb(180, 111, 88);
			border:5rpx rgb(180, 111, 88) solid;
		}
		
		.button.nomargin{
			margin-top: 25rpx;
		}
		 
		.button:active {  
			background-color:rgb(234, 171, 11);
		}

	}
	
	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */
	.slide-fade-enter-active {
	  transition: all .3s ease;
	}
	.slide-fade-leave-active {
	  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to
	/* .slide-fade-leave-active for below version 2.1.8 */ {
	  transform: translateX(10px);
	  opacity: 0;
	}
	
	.step{
		position:absolute;
		width:calc(100% - 100rpx);
	}
</style>
