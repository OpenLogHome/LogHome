<template>
	<div class="content" v-dark>
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon"/></div>
			<input class="input" type="email" :placeholder="$t('settings.activate.emailPlaceholder')" v-model="email"/>
			<div class="btn" v-show="!isWaiting" @click="sendCode">{{ $t('settings.activate.sendCode') }}</div>
			<div class="btn wait" v-show="isWaiting">{{ $t('settings.activate.waitSeconds', { seconds: waitTime }) }}</div>
		</div>
		<div style="display:flex;width:100%;justify-content: center;">
			<slide-verify :l="42"
			            :r="10"
			            :h="155"
			            :slider-text="$t('settings.activate.slideRight')"
			            @success="verifyResult"
						:imgs="$moveVerifyImgs"
			            ></slide-verify>
		</div>
		<!--End用户名输入框-->
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon"/></div>
			<input class="input" type="text" :placeholder="$t('settings.activate.codePlaceholder')" v-model="vcode" />
		</div>

		<!--End密码输入框-->
		<div class="button" @click="submit">{{ $t('common.submit') }}</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import moveVerify from '../../components/helang-moveVerify/helang-moveVerify.vue'
	export default {
		components: {
			moveVerify
		},
		data() {
			return {
				email:"",
				vcode: "",
				resultData: false,
				isWaiting:false,
				waitTime:60,
				waitTimer:undefined
			}
		},
		onLoad() {

		},
		methods: {
			verifyResult(res) {
				this.resultData = true;
			},
			sendCode() {
				let _this = this;
				if (this.resultData == false) {
					uni.showToast({
						title: this.$t('settings.activate.slideVerifyRequired'),
						icon: 'error',
						duration: 2000
					});
					return;
				}

				// 验证邮箱格式
				const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				if(!emailPattern.test(this.email)){
					uni.showToast({
						title: this.$t('settings.activate.invalidEmail'),
						icon: 'none',
						duration: 2000
					});
					return;
				}

				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(tk) tk = tk.tk;

				if(tk == null){
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './login?msg=' + 'unAuthorized'
					});
					return;
				}

				uni.showLoading({
					title: this.$t('settings.activate.sending')
				});

				axios.get(this.$baseUrl + '/users/send_bind_email_code?email=' + _this.email, {
					headers: {
					     'Content-Type': 'application/json',
					     'Authorization': tk
					}
				})
				.then(function (response) {
				  uni.hideLoading();
				  uni.showToast({
				  	title: response.data.msg,
					icon: 'none',
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
				  uni.hideLoading();
				  if(error.response && error.response.data && error.response.data.msg) {
					  uni.showToast({
						title: error.response.data.msg,
						icon: 'none',
						duration: 2000
					  });
				  } else {
					  uni.showToast({
						title: _this.$t('settings.activate.sendFailed'),
						icon: 'none',
						duration: 2000
					  });
				  }
				  console.log(error);
				});
			},
			submit(){
				// 验证邮箱格式
				const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				if(!emailPattern.test(this.email)){
					uni.showToast({
						title: this.$t('settings.activate.invalidEmail'),
						icon: 'none',
						duration: 2000
					});
					return;
				}

				if(this.vcode.length < 4) {
					uni.showToast({
						title: this.$t('settings.activate.invalidCode'),
						icon: 'none',
						duration: 2000
					});
					return;
				}

				uni.showLoading({
					title: this.$t('common.verifying')
				});

				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(tk) tk = tk.tk;

				let _this = this;
				if(tk == null){
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './login?msg=' + 'unAuthorized'
					});
					return;
				}

				axios.post(this.$baseUrl + '/users/verify_bind_email', {
					email: this.email,
					code: this.vcode
				}, {
					headers: {
					     'Content-Type': 'application/json',
					     'Authorization': tk
					}
				}).then((res) => {
					uni.hideLoading();
					if(res.data.success) {
						uni.showToast({
							title: this.$t('settings.activate.emailBindSuccess'),
							icon: 'success',
							duration: 2000
						});
						setTimeout(()=>{
							uni.switchTab({
								url: '../me',
							})
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.msg || this.$t('settings.activate.verifyCodeFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				}).catch(function(error) {
					uni.hideLoading();
					console.log(JSON.stringify(error));
					if(error.response && error.response.data && error.response.data.msg) {
						uni.showToast({
							title: error.response.data.msg,
							icon: 'none',
							duration: 2000
						});
					} else {
						uni.showToast({
							title: _this.$t('settings.activate.verifyFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				})
			}
		}
	}
</script>

<style scoped>
	.content {
		width: 100%;
		height: 100%;
		padding-top: 1%;
		text-align: center;
		background-color: var(--background-color-secondary);
	}

	.longin-boder {
		width: 80%;
		height: 40px;
		margin-top: 30px;
		margin-left: 10%;
		line-height: 40px;
		text-align: center;
		border: 1px solid var(--border-color);
		border-radius: 5px;
		background-color: var(--background-color-secondary);
		position:relative;
	}

	img.icon {
		width: 70rpx;
	}

	.image {
		width: 50rpx;
		float: left;
		text-align: right;
	}

	.input {
		width: 80%;
		float: left;
		margin-left: 5%;
		height: 37px;
		line-height: 37px;
		border: 0px;
		color: var(--text-color-primary);
		font-size: 16px;
		background-color: var(--background-color-secondary);

	}
	.btn{
		position:absolute;
		right:15rpx;
		color:var(--brand-text-color);
	}
	.btn.wait{
		color:rgb(154, 154, 154);
	}

	.button {
		height: 40px;
		width: 80%;
		margin-top: 30px;
		margin-left: 10%;
		font-size: 16px;

		font-weight: bold;
		line-height: 38px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(180, 111, 88);

	}

	.button:active {
		background-color: rgb(225, 139, 110);
	}

	.moveVerify {
		width: 80%;
		margin-left: 10%;
		margin-top: 30px;
	}
</style>