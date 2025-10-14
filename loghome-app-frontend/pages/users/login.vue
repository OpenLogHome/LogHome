<template>
	<div class="outer">
		<!-- 后台按钮组件 -->
		<zetank-backBar textcolor="#000" :showLeft="true" :showTitle="false" navTitle='标题'></zetank-backBar>
		<div class="content-container">
			<div class="welcome-section">
				<div class="appTitle">
					<div class="title">在<span style="color: #FF6000;">原木社区</span>，</div>
					<div class="title typewriter">{{ currentText }}</div>
				</div>
			</div>
			
			<!-- 轮播图部分 -->
			<div class="carousel-section">
				<swiper class="carousel-swiper" 
					:indicator-dots="true" 
					:autoplay="false" 
					:interval="3000" 
					:duration="500"
					:circular="true"
					@change="onSwiperChange">
					<swiper-item v-for="(item, index) in carouselItems" :key="index">
						<view class="carousel-item">
							<image class="carousel-image" :src="item.image" mode="aspectFit"></image>
							<text class="carousel-title">{{item.title}}</text>
						</view>
					</swiper-item>
				</swiper>
			</div>
			
			<div class="buttons-section">
				<div class="loginBtn button" @click="gotoLoginEmail">
					使用邮箱登录
				</div>
				<!-- <div class="loginBtn login2 button" @click="gotoLoginMobile">
					使用手机号登录（旧）
				</div> -->
				<div class="loginBtn login2 button" @click="gotoLoginAccount">
					使用账号密码登录
				</div>
				<div class="checkBox" :class="{ shake: noActivated }">
					<label style="display: flex;flex-direction: row;font-size: 22rpx; margin-top: 50rpx;
					width:100%; justify-content: center;">
						<checkbox-group  @change="selectCk">
							<checkbox value="yes" color="rgb(180, 111, 88)"/>
						</checkbox-group>
						<span style="display: flex;flex-direction: row; ">我已经阅读并同意
							<navigator url="../static/privacyAgreement" open-type="navigate" style="color: #FF6000;border-bottom: 1px solid  #FF6000;">原木社区用户隐私政策
							</navigator>
						</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				checked:false,
				noActivated:false,
				textArray: ['创作无限可能', '书写方块故事', '与创作者对话', '探索方块世界'],
				currentText: '',
				currentIndex: 0,
				isDeleting: false,
				typingSpeed: 150,
				deletingSpeed: 50,
				pauseTime: 2000,
				// 轮播图数据
				carouselItems: [
					{
						image: '/static/carousel/lib.png',
						title: '海量故事任你挑选'
					},
					{
						image: '/static/carousel/read.png',
						title: '自由舒适的阅读体验'
					},
					{
						image: '/static/carousel/write.png',
						title: '多端同步故事创作'
					},
					{
						image: '/static/carousel/comm.png',
						title: '与其他创作者互动'
					}
				],
				currentCarouselIndex: 0
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
			// 启动打字机效果
			this.typeText()
		},
		methods:{
			// 打字机效果实现
			typeText() {
				const currentPhrase = this.textArray[this.currentIndex];
				
				// 如果正在删除文字
				if (this.isDeleting) {
					// 删除一个字符
					this.currentText = currentPhrase.substring(0, this.currentText.length - 1);
					
					// 如果已经删除完毕，切换到下一个短语
					if (this.currentText === '') {
						this.isDeleting = false;
						this.currentIndex = (this.currentIndex + 1) % this.textArray.length;
						setTimeout(() => {
							this.typeText();
						}, 500); // 短暂停顿后开始输入新短语
						return;
					}
				} else {
					// 添加一个字符
					this.currentText = currentPhrase.substring(0, this.currentText.length + 1);
					
					// 如果已经输入完毕，等待一段时间后开始删除
					if (this.currentText === currentPhrase) {
						setTimeout(() => {
							this.isDeleting = true;
							this.typeText();
						}, this.pauseTime);
						return;
					}
				}
				
				// 继续打字或删除
				setTimeout(() => {
					this.typeText();
				}, this.isDeleting ? this.deletingSpeed : this.typingSpeed);
			},
			// 轮播图切换事件
			onSwiperChange(e) {
				this.currentCarouselIndex = e.detail.current;
			},
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
			gotoLoginEmail() {
				if(this.checked){
					uni.navigateTo({
						url:"./login_page_email"
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
			gotoLoginAccount(){
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
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #ffffff 0%, #f8dac6 50%, #ffe6dc 100%);
		background-size: 200% 200%;
		animation: gradientAnimation 15s ease infinite;
		
		.content-container{
			height:100vh;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			padding-top: 50rpx;
			
			.welcome-section {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				margin-left: 15%;
				margin-top: 5vh;
				margin-bottom: 5vh;
				
				div.appTitle{
					text-align: left;
					.title{
						font-size: 60rpx;
						font-weight: bold;
						color: #303030;
					}
					.subtitle{
						font-size: 42rpx;
						color: #303030;
						margin-top: 20rpx;
					}
				}
			}
			
			.carousel-section {
				width: 100%;
				height: 30vh;
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.carousel-swiper {
					width: 90%;
					height: 100%;
				}
				
				.carousel-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 100%;
					
					.carousel-image {
						width: 300rpx;
						height: 300rpx;
					}
					
					.carousel-title {
						margin-top: 20rpx;
						font-size: 36rpx;
						color: #303030;
						font-weight: bold;
					}
				}
			}
			
			.buttons-section {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 10vh;
				
				.loginBtn{
					width: 80vw;
					margin: 15rpx 0;
					padding: 0;
				}
				.login2{
					background-color: rgba(234, 112, 52,0) !important;
					border: 0;
					font-size: 32rpx;
					box-sizing: border-box;
					color: rgb(180, 111, 88);
				}
				.checkBox{
					margin-top: 30rpx;
				}
			}
		}
		.button {
			height: 100rpx;
			width: 80vw;
			font-size: 36rpx;
			font-weight: bold;
			line-height: 90rpx;
			border-radius: 15rpx;
			color: #ffffff;
			text-align: center;
			border: 5rpx rgb(180, 111, 88) solid;
			box-sizing: border-box;
			background-color: rgb(180, 111, 88);
			transition: all .1s;
		}
		
		.button.long{
			width: calc(80vw + 20px);
		}
		
		.button:not(.login2):active{
			background-color: rgb(255, 170, 127) !important;
			border-color: rgb(255, 170, 127);
			transform: scale(.9);
		}
		
		.typewriter {
			display: inline-block;
			border-right: 3px solid #FF6000;
			padding-right: 5px;
			animation: blink 0.7s step-end infinite;
			height: 90rpx;
		}
		
		@keyframes blink {
			from, to { border-color: transparent }
			50% { border-color: #FF6000; }
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
	
	@keyframes gradientAnimation {
	  0% {
	    background-position: 0% 50%;
	  }
	  50% {
	    background-position: 100% 50%;
	  }
	  100% {
	    background-position: 0% 50%;
	  }
	}
</style>
