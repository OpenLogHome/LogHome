<template>
	<div class="content" v-dark>
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon"/></div>
			<input class="input" type="password" :placeholder="$t('auth.changePwd.oldPwdPlaceholder')" v-model="pwd" />
		</div>
		<!--End用户名输入框-->
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon"/></div>
			<input class="input" type="password" :placeholder="$t('auth.changePwd.newPwdPlaceholder')" v-model="newPwd1" />
		</div>
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon"/></div>
			<input class="input" type="password" :placeholder="$t('auth.changePwd.confirmPwdPlaceholder')" v-model="newPwd2" />
		</div>
		<div style="display:flex;width:100%;justify-content: center;">
			<slide-verify :l="42"
			            :r="10"
			            :h="155"
			            :slider-text="$t('auth.changePwd.sliderText')"
			            @success="verifyResult"
						:imgs="$moveVerifyImgs"
			            ></slide-verify>
		</div>
<!-- 		<move-verify @result='verifyResult' class="moveVerify"></move-verify> -->
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
				pwd: "",
				newPwd1: "",
				newPwd2: "",
				resultData: false
			}
		},
		onLoad() {

		},
		methods: {
			verifyResult(res) {
				//console.log(res);
				this.resultData = true;
			},
			//校验密码：只能输入6-20个字母、数字、下划线
			isPasswd(s) {
				var patrn = /^(\w){6,20}$/;
				if (!patrn.exec(s)) return false
				return true
			},
			submit() {
				if (this.pwd == "") {
					uni.showToast({
						title: this.$t('auth.changePwd.oldPwdRequired'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.newPwd1 != this.newPwd2) {
					uni.showToast({
						title: this.$t('auth.changePwd.passwordMismatch'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.newPwd1 == this.pwd) {
					uni.showToast({
						title: this.$t('auth.changePwd.sameAsOldPwd'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.isPasswd(this.newPwd1) != true) {
					uni.showToast({
						title: this.$t('auth.changePwd.passwordRule'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				if (this.resultData == false) {
					uni.showToast({
						title: this.$t('auth.changePwd.sliderFirst'),
						icon: 'error',
						duration: 2000
					});
					return;
				}
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				//console.log(tk);
				axios.post(this.$baseUrl + '/users/change_pwd',
						{
							password: this.pwd,
							newPwd: this.newPwd1
						},
						{
							headers: {
								'Content-Type': 'application/json', //设置请求头请求格式为JSON
								'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
							}
						},
					)
					.then(function(response) {
						window.localStorage.removeItem('token');
						uni.showToast({
							title: this.$t('auth.changePwd.changeSuccess'),
							icon: 'none',
							duration: 2000
						});
						setTimeout(()=>{
							uni.switchTab({
								url: '../library',
							})
						},2000)
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
								title: this.$t('auth.changePwd.wrongOldPwd'),
								icon: 'none',
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
	}

	.longin-boder {
		width: 80%;
		height: 40px;
		margin-top: 30px;
		margin-left: 10%;
		margin-bottom: 30px;
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
