<template>
	<div class="content" v-dark>
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon"/></div>
			<input class="input" type="text" :placeholder="$t('auth.register.accountPlaceholder')" v-model="account"/>
		</div>
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon"/></div>
			<input class="input" type="password" :placeholder="$t('auth.register.passwordPlaceholder')" v-model="pwd1" />
		</div>
		<!--End用户名输入框-->
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon"/></div>
			<input class="input" type="password" :placeholder="$t('auth.register.confirmPwdPlaceholder')" v-model="pwd2" />
		</div>
		<move-verify @result='verifyResult' class="moveVerify"></move-verify>
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
				account:"",
				pwd1: "",
				pwd2: "",
				resultData: false
			}
		},
		onLoad() {

		},
		methods: {
			verifyResult(res) {
				//console.log(res);
				this.resultData = res.flag;
			},
			//校验密码：只能输入6-20个字母、数字、下划线
			isPasswd(s) {
				var patrn = /^(\w){6,20}$/;
				if (!patrn.exec(s)) return false
				return true
			},
			submit() {
				if (this.pwd1 == "") {
					uni.showToast({
						title: this.$t('auth.register.passwordRequired'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.pwd1 != this.pwd2) {
					uni.showToast({
						title: this.$t('auth.register.passwordMismatch'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.isPasswd(this.pwd1) != true) {
					uni.showToast({
						title: this.$t('auth.register.passwordRule'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.resultData == false) {
					uni.showToast({
						title: this.$t('auth.register.sliderFirst'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				//账号格式4-12位字母数字
				let accountPattern = /^[a-zA-Z0-9]{4,12}$/;
				//密码格式6-22位字母数字组合
				let passwordPattern = /^[a-zA-Z0-9]{6,22}$/;
				if(!accountPattern.test(this.account)){
					uni.showToast({
						title: this.$t('auth.register.accountRule'),
						icon:'none',
						duration: 2000
					});
					return;
				}
				axios.post(this.$baseUrl + '/users/register', {
				    username: this.account,
				    password: this.pwd1
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
							title: this.$t('auth.register.accountTaken'),
							icon:'none',
							duration: 2000
						  });
					  }

				  });
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
		background-color: var(--card-background);
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
