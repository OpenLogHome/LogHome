<template>
	<div class="content">
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon"/></div>
			<input class="input" type="email" placeholder="输入邮箱地址" v-model="email"/>
			<div class="btn" v-show="!isWaiting" @click="sendCode">发送验证码</div>
			<div class="btn wait" v-show="isWaiting">等待{{waitTime}}秒</div>
		</div> 
		<div style="display:flex;width:100%;justify-content: center;">
			<slide-verify :l="42"
			            :r="10"
			            :h="155"
			            slider-text="向右滑动"
			            @success="verifyResult"
						:imgs="$moveVerifyImgs"
			            ></slide-verify>
		</div>
		<!--End用户名输入框-->
		<div class="longin-boder">
			<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon"/></div>
			<input class="input" type="text" placeholder="验证码" v-model="vcode" />
		</div>
		
		<!--End密码输入框-->
		<div class="button" @click="submit">提交</div>
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
						title: "请滑动验证滑块",
						icon: 'error',
						duration: 2000
					});
					return;
				}
				
				// 验证邮箱格式
				const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				if(!emailPattern.test(this.email)){
					uni.showToast({
						title: "请输入有效的电子邮箱地址",
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
					title: '发送中'
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
						title: "发送失败，请稍后重试",
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
						title: "请输入有效的电子邮箱地址",
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				if(this.vcode.length < 4) {
					uni.showToast({
						title: "请输入有效的验证码",
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				uni.showLoading({
					title: '验证中'
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
							title: "邮箱绑定成功",
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
							title: res.data.msg || "验证失败，请检查验证码",
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
							title: "验证失败，请稍后重试",
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
		background-color: #f2f2f2;
	}

	.longin-boder {
		width: 80%;
		height: 40px;
		margin-top: 30px;
		margin-left: 10%;
		line-height: 40px;
		text-align: center;
		border: 1px solid #dddddd;
		border-radius: 5px;
		background-color: #efefef;
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
		color: #333333;
		font-size: 16px;
		background-color: #efefef;

	}
	.btn{
		position:absolute;
		right:15rpx;
		color:rgb(180, 111, 88);
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