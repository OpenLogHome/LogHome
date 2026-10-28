<template>
	<div class="outer" v-dark>
		<div class="content">
			<img class="logo" src="/static/logo.png"></img>
			<view class="text-area">
				<div class="title">{{ $t('auth.login.account.title') }}</div>
				<div class="version" v-show="$store.state.appVersion">{{ $t('auth.login.account.appVersion') }}{{this.$store.state.appVersion}}</div>
			</view>
			<div class="longin-boder">
				<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon" /></div>
				<input class="input" type="text" :placeholder="$t('auth.login.account.accountPlaceholder')" v-model="account"/>
			</div>
			<!--End用户名输入框-->
			<div class="longin-boder">
				<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon" /></div>
				<input class="input" type="password" :placeholder="$t('auth.login.passwordPlaceholder')" v-model="pwd"/>
			</div>
			<!--End密码输入框-->
			<div class="button" @click="login">{{ $t('auth.login.signIn') }}</div>
			<label class="agreement-row">
				<checkbox-group  @change="selectCk">
					<checkbox value="yes" color="rgb(180, 111, 88)"/>
				</checkbox-group>
				<span class="agreement-copy">{{ $t('auth.login.agreeAccept') }}
					<navigator class="agreement-link" url="../static/privacyAgreement" open-type="navigate">{{ $t('auth.login.privacyPolicy') }}
					</navigator>
				</span>
			</label>

			<div class="auth-actions">
				<div class="button-small" @click="forgotten">{{ $t('auth.login.forgotPassword') }}</div>
				<div class="button-small" @click="register">{{ $t('auth.login.account.signUp') }}</div>
			</div>


			<div class="certification" style="padding-top: 200rpx;">
				<a href="https://www.12377.cn/" target="_blank" style="
				                        background-color:var(--card-background);
				                        display: inline-block;
				                        padding: 5px 8px;
				                        border: 1px solid var(--border-color);
				                        border-radius: 5px;
				                        margin: 5px 0;
										text-decoration:none;
										color:#939393;
										vertical-align: middle;
										font-size: 30rpx;
					                    "><img src="../../static/buliang.svg" :alt="$t('auth.login.account.reportZone')" style="
				                        margin-right: 5px;
				                        width: 35rpx;
				                        height: 35rpx;" />{{ $t('auth.login.account.reportZone') }}</a>

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
				version:"Alpha 0.1.1",
				account:"",
				pwd:"",
				checked:false
			}
		},
		onLoad(params) {
			if(params.msg != undefined) {
				uni.showToast({
					title: this.$t('common.needLogin'),
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
						title: this.$t('auth.login.account.agreeRequired'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				return axios.post(this.$baseUrl + '/users/login', {
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
				  .catch((error) => {
					  //console.log(error);
					  if(error) {
						  uni.showToast({
							title: this.$t('auth.login.invalidCredential'),
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
		background-color: var(--background-color-secondary);
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
		border: 1px solid var(--border-color);
		border-radius: 5px;
		background-color: var(--background-color-secondary);
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
		color: var(--text-color-primary);
		font-size: 16px;
		background-color: var(--background-color-secondary);

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

	.agreement-row {
		width: 80%;
		margin: 50rpx auto 0;
		display: flex;
		align-items: center;
		gap: 12rpx;
		font-size: 28rpx;
		text-align: left;
	}

	.agreement-copy {
		display: flex;
		align-items: baseline;
		min-width: 0;
	}

	.agreement-link {
		color: #FF6000;
		border-bottom: 1px solid #FF6000;
		white-space: nowrap;
	}

	.auth-actions {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 40rpx;
		margin-top: 30rpx;
	}


	div.back{
		position:absolute;
		z-index: -1;
		bottom:0;
	}


	.button-small {
		width: auto;
		margin: 0;
		font-size: 16px;
		font-weight: bold;
		text-align: center;
		line-height: 1.4;
		border-radius: 5px;
		color: var(--brand-text-color);

	}
</style>
