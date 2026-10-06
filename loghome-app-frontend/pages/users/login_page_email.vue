<template>
	<view class="outer" v-dark>
		<div class="step0" v-if="step == 0">
			<p>{{ $t('auth.login.email.unregisteredTip') }}</p>
			<div class="longin-boder">
				<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon" /></div>
				<input class="input" type="email" :placeholder="$t('auth.login.email.emailPlaceholder')" v-model="email"/>
			</div>
			<div class="button" @click="nextStep()">{{ $t('auth.login.next') }}</div>
		</div>
		<!-- <transition name="slide-fade" mode="out-in">
			<div class="step step1" v-if="step == 1">
				<p>滑动验证以发送验证码到{{email}}</p>
				<div style="display:flex;width:100%;justify-content: center;">
					<slide-verify :l="42"
					            :r="10"
					            :h="155"
					            slider-text="向右滑动"
					            @success="verifyResult"
								:imgs="$moveVerifyImgs"
					            ></slide-verify>
				</div>
				<div class="button cancel" @click="step = 0">上一步</div>
			</div>
		</transition> -->
		<transition name="slide-fade" mode="out-in">
			<div class="step step2" v-if="step == 2">
				<div class="lr">
					<div class="identity-copy">
						<div class="identity-label">{{ $t('auth.login.codeSentTo') }}</div>
						<div class="identity-value">{{email}}</div>
					</div>
					<div class="btn" v-show="!isWaiting" @click="sendCode">{{ $t('auth.login.resend') }}</div>
					<div class="btn wait" v-show="isWaiting">{{ $t('auth.login.waitSeconds', { seconds: waitTime }) }}</div>
				</div>
				<div class="longin-boder">
					<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon" /></div>
					<input class="input" type="text" :placeholder="$t('auth.login.codePlaceholder')" v-model="verifyCode"/>
				</div>

				<div class="button" @click="nextStep()">{{ $t('auth.login.next') }}</div>
				<div class="button cancel nomargin" @click="step = 0">{{ $t('auth.login.previous') }}</div>
			</div>
		</transition>
		<transition name="slide-fade" mode="out-in">
			<div class="step step3" v-if="step == 3">
				<p>{{ $t('auth.login.welcomeSetup') }}</p>
				<div class="longin-boder" v-if="!forgetPwd">
					<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon" /></div>
					<input class="input" type="text" :placeholder="$t('auth.login.accountPlaceholder')" v-model="account" @input="checkAccount"/>
				</div>
				<div class="warn" v-show="accountUsed && !forgetPwd">{{ $t('auth.login.accountUsed') }}</div>
				<div class="longin-boder">
					<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon" /></div>
					<input class="input" type="password" :placeholder="$t('auth.login.passwordPlaceholder')" v-model="pwd"/>
				</div>

				<div class="button" @click="nextStep()">{{ $t('auth.login.next') }}</div>
				<div class="button cancel nomargin" @click="step = 0;">{{ $t('auth.login.previous') }}</div>
			</div>
		</transition>
		<transition name="slide-fade" mode="out-in">
			<div class="step step5" v-if="step == 5">
				<div class="lr">
					<div class="identity-copy">
						<div class="identity-label">{{ $t('auth.login.email.signInWith') }}</div>
						<div class="identity-value">{{email}}</div>
					</div>
					<div class="btn" @click="forgetPwd=true;step = 2">{{ $t('auth.login.forgotPassword') }}</div>
				</div>
				<div class="longin-boder">
					<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon" /></div>
					<input class="input" type="password" :placeholder="$t('auth.login.passwordPlaceholder')" v-model="pwd"/>
				</div>

				<div class="button" @click="nextStep()">{{ $t('auth.login.signIn') }}</div>
				<div class="button cancel nomargin" @click="step = 0">{{ $t('auth.login.previous') }}</div>
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
				//0：待输入邮箱 1：新用户注册，滑动验证码 2：填写验证码 3：新用户注册，填写账号和密码 5：老用户登录，填写密码
				account:"",
				email:"",
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
						// 验证邮箱格式
						const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
						if(!emailPattern.test(this.email)){
							uni.showToast({
								title: this.$t('auth.login.email.invalidEmail'),
								icon: 'none',
								duration: 2000
							});
							return;
						}
						uni.showLoading({

						})
						axios.get(this.$baseUrl + '/users/check_email?email=' + this.email, {}).then((res) => {
							if(res.data.length > 0){
								this.step = 5;
							} else {
								this.step = 2;
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
						axios.get(this.$baseUrl + '/users/register_with_email?email=' + this.email + "&vcode=" +
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
						title: this.$t('auth.login.sliderFirst'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				var axios = require('axios');

				var config = {
				  method: 'get',
				  url: this.$baseUrl + '/users/send_email_verify_code?email=' + _this.email,
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
					title: this.$t('common.verifying')
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
				axios.get( this.$baseUrl + '/users/verify_email?email=' + this.email + "&vcode=" + this.vcode, {
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					if(res.data.msg == "登录成功")
					{
						uni.showToast({
							title: this.$t('auth.login.bindSuccess'),
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
				return axios.post(this.$baseUrl + '/users/login', {
				    username: this.email,
				    password: this.pwd,
					is_hypernotion: this.$store.state.hypernotion
				  })
				  .then(function (response) {
				    window.localStorage.setItem('token', JSON.stringify(response.data.token));
					uni.reLaunch({
						url:'../me'
					})
				  })
				  .catch((error) => {
					  //console.log(error);
					  if(error) {
						  uni.showToast({
							title: this.$t('auth.login.invalidCredential'),
							icon:'none',
							duration: 2000
						  });
						  this.pwd = "";
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
						title: this.$t('auth.login.passwordRequired'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.isPasswd(this.pwd) != true) {
					uni.showToast({
						title: this.$t('auth.login.passwordRule'),
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
						title: this.$t('auth.login.email.accountRule'),
						icon:'none',
						duration: 2000
					});
					return;
				}
				axios.post(this.$baseUrl + '/users/register', {
				    username: this.account,
				    password: this.pwd,
					email: this.email,
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
							title: this.$t('auth.login.accountTaken'),
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
		padding:56rpx 50rpx calc(80rpx + var(--loghome-safe-bottom, 0px));
		box-sizing: border-box;
		font-size: 35rpx;
		div.lr{
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 12rpx 20rpx;
			padding: 24rpx;
			border: 1px solid var(--border-color);
			border-radius: 16rpx;
			background-color: var(--card-background, var(--background-color-secondary));
			color: var(--text-color-primary);
			.identity-copy{
				display: contents;
			}
			.identity-label{
				grid-column: 1;
				grid-row: 1;
				align-self: center;
				font-size: 26rpx;
				line-height: 1.5;
				color: var(--text-color-secondary, var(--text-color-primary));
			}
			.identity-value{
				grid-column: 1 / -1;
				grid-row: 2;
				min-width: 0;
				font-size: 32rpx;
				font-weight: 500;
				line-height: 1.5;
				overflow-wrap: anywhere;
				word-break: break-word;
			}
			.btn{
				grid-column: 2;
				grid-row: 1;
				align-self: center;
				padding: 8rpx 0 8rpx 12rpx;
				font-size: 26rpx;
				line-height: 1.5;
				white-space: nowrap;
				cursor: pointer;
				color:var(--brand-text-color);
			}
			.btn.wait{
				color:rgb(154, 154, 154);
			}
		}
		p{
			color:var(--text-color-primary);
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
			border: 1px solid var(--border-color);
			border-radius: 5px;
			background-color: var(--background-color-secondary);
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
				color: var(--text-color-primary);
				font-size: 16px;
				background-color: var(--background-color-secondary);
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
			color: var(--brand-text-color);
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
		position: relative;
		width: 100%;
		min-width: 0;
	}
</style>