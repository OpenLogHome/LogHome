<template>
	<div class="outer">
		<!-- 后台按钮组件 -->
		<zetank-backBar textcolor="#000" :showLeft="true" :showTitle="false" navTitle='标题'></zetank-backBar>
		<div class="backImg">
			<div class="appTitle">
				<div class="title">欢迎来到 原木社区</div>
				<div class="subtitle">方块跃然纸上，故事在此生长</div>
			</div>
			<div class="loginBtn button" @click="gotoLoginMobile">
				使用手机号登录
			</div>
<!-- 			<div class="loginBtn login2 button" @click="gotoLogin">
				使用账号登录
			</div> -->
			<div class="checkBox" :class="{ shake: noActivated }">
				<label style="display: flex;flex-direction: row;font-size: 22rpx; margin-top: 50rpx;
				width:100vw; justify-content: center;">
					<checkbox-group  @change="selectCk">
						<checkbox value="yes" color="rgb(180, 111, 88)"/>
					</checkbox-group>
					<span style="display: flex;flex-direction: row; ">我已经阅读并同意
						<navigator url="../static/privacyAgreement" open-type="navigate" style="color: #FF6000;border-bottom: 1px solid  #FF6000;">原木社区用户隐私政策
						</navigator>
					</span>
				</label>
			</div>
<!-- 			<img src="../../static/login/底部.png" alt="" class="bottomPart"> -->
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				checked:false,
				noActivated:false
			}
		},
		onLoad(params){
			if(params.msg != undefined) {
				uni.showToast({
					title: "请先登录",
					icon:'none',
					duration: 2000
				});
			}
			window.sessionStorage.removeItem('uni_token')
		},
		methods:{
			gotoLoginMobile(){
				if(this.checked){
					uni.navigateTo({
						url:"./login_page_mobile"
					})
				} else {
					uni.showToast({
						title: "请先阅读并同意《原木社区用户隐私政策》",
						icon: 'none',
						duration: 2000
					});
					this.noActivated = true;
					setTimeout(()=>{
						this.noActivated = false;
					},820)
				}
				
			},
			gotoLogin(){
				if(this.checked){
					uni.navigateTo({
						url:"./login_page"
					})
				} else {
					uni.showToast({
						title: "请先阅读并同意《原木社区用户隐私政策》",
						icon: 'none',
						duration: 2000
					});
					this.noActivated = true;
					setTimeout(()=>{
						this.noActivated = false;
					},820)
				}
				
			},
			selectCk(e){
				if(e.detail.value.length != 0){
					this.checked = true;
				}else {
					this.checked = false;
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		height:100vh;
		.backImg{
			background: url(../../static/login/background.png) center;
			background-size:cover;
			height:100vh;
			div.appTitle{
				text-align: center;
				position:absolute;
				width:100vw;
				top:74vh;
				.title{
					font-size:50rpx;
					font-weight: bold;
					color: #8f8f94;
				}
				.subtitle{
					font-size:34rpx;
					color: #8f8f94;
				}
			}
			.loginBtn{
				position:absolute;
				z-index:1;
				top:82.5vh;
				width:70vw;
				margin:0 15vw;
				padding:0;
			}
			.login2{
				top:89vh;
				background-color: rgba(234, 112, 52,0) !important;
				border:0;
				font-size:32rpx;
				box-sizing: border-box;
				color: rgb(180, 111, 88);
			}
			.checkBox{
				position:absolute;
				z-index:1;
				top:88vh;
				margin-left:20rpx;
			}
		}
		.button {
			height: 100rpx;
			width: 70vw;
			margin-top: 15rpx;
			margin-left: 10rpx;
			margin-right: 10rpx;
			font-size: 36rpx;
			font-weight: bold;
			line-height: 90rpx;
			border-radius: 15rpx;
			color: #ffffff;
			text-align:center;
			border:5rpx rgb(180, 111, 88) solid;
			box-sizing: border-box;
			background-color: rgb(180, 111, 88);
			transition: all .1s;
		}
		
		.button.long{
			width: calc(70vw + 20px);
		}
		
		.button:not(.login2):active{
			background-color: rgb(255, 170, 127) !important;
			border-color: rgb(255, 170, 127);
			transform: scale(.9);
		}
	}
	
	.shake {
	  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	  transform: translate3d(0, 0, 0);
	  backface-visibility: hidden;
	  perspective: 1000px;
	}
	
	@keyframes shake {
	  10%,
	  90% {
	    transform: translate3d(-1px, 0, 0);
	  }
	
	  20%,
	  80% {
	    transform: translate3d(2px, 0, 0);
	  }
	
	  30%,
	  50%,
	  70% {
	    transform: translate3d(-4px, 0, 0);
	  }
	
	  40%,
	  60% {
	    transform: translate3d(4px, 0, 0);
	  }
	}
</style>
