<template>
	<view :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<view class="top-swiper">
			 <view class="bg">
				 <view class="placeholder"></view>
				 <view class="image">
					 <log-image v-for="(item,index) in swiper.books" :src="item.picUrl" mode="aspectFill" 
							:style="{opacity:swiper.index == index ? 1 : 0}"
							onerror="onerror=null;src='https://s2.loli.net/2021/12/06/iTkPD6cudGrsEKR.png'"></log-image>
				 </view>
			 </view>
			 <view class="box">
				<view style="height: 44px;"></view>
			 	<swiper class="swiper" :previous-margin="swiper.margin" :next-margin='swiper.margin' :circular="false" @change="swiperChange">
			 		<swiper-item v-for="(item,index) in swiper.books" :key="index">
			 			<log-image class='le-img' :src='item.picUrl' :class="{'le-active':swiper.index == index}"
						onerror="onerror=null;src='https://s2.loli.net/2021/12/06/iTkPD6cudGrsEKR.png'"></log-image>
			 		</swiper-item>
					<swiper-item>
						<div class='le-btn' :class="{'le-active':swiper.index == list.length}">
							<p>
								+
							</p>
						</div>
					</swiper-item>
			 	</swiper> 
			 </view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			list:{
				type:Array,
				default(){
					return  [ ]
				}
			}
		},
		data() {
			return {
				swiper: {
					margin: "160rpx",
					index: 0,
					books:[],
				}
			}
		},
		components: {

		},
		onShow() {
			this.init();
		},
		onLoad(){
			this.init();
		},
		mounted(){
			this.init();
		},
		methods: {
			init(){
				this.swiper.books = this.list;
			},
			//swiper滑动事件
			swiperChange: function(e) {
				this.swiper.index = e.detail.current;
				if(this.swiper.index == this.list.length) {
					this.$emit("swiperChange",-1);
				} else {
					this.$emit("swiperChange",this.swiper.index);
				}
			},
			reload(books){
				console.log("reloadCardSwiper", books);
				this.swiper.books = books;
			}
		}
	}
</script>

<style lang="scss">
	
	.top-swiper{
		
		.bg{
			padding-top: calc(var(--status-bar-height) + var(--statusBarHeight));
			box-sizing: content-box;
			width: 100%;
			position: relative;
			
			.placeholder{
				box-sizing: content-box;
				padding-top: 600rpx;
				height: 35px;
			}
			
			.image{
				box-sizing: content-box;
				position: absolute;
				z-index: 1;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
				opacity:1;
				
				background-color: rgb(255,248,234);
				
				img{
					transition:opacity .5s;
				}
				
				&::after{
					content: '';
					position: absolute;
					width: 100%;
					height: 100%;
					z-index: 1;
					bottom: 0;
					left: 0;
					height: 65%;
					background-image: linear-gradient(to bottom ,transparent, #FFF);
				}
				
				> img{
					position: absolute;
					box-sizing: content-box;
					padding: 60px;
					top: 0;
					left: 0;
					width: 100%;
					height: 80%;
					top: -60px;
					left: -60px;
					filter: blur(50px);
				}
			}
		}
		
		.box{
			padding-top: var(--status-bar-height);
			box-sizing: content-box;
			position: absolute;
			z-index: 5;
			top: 0;
			left: 0;
			width: 100%;
			height: auto;
		}
		
		.swiper {
			height: 590rpx;
			margin: 0 0rpx;
			padding-top: calc(10rpx + var(--statusBarHeight));
			.le-img {
				width: 100%;
				height: 100%;
				display: block;
				transform: scale(0.8);
				transition: transform 0.3s ease-in-out 0s;
				border-radius: 4px;

		
				&.le-active {
					transform: scale(0.9);
				}
			}
			
			.le-btn {
				width: 100%;
				height: 68%;
				display: block;
				transform: scale(0.8);
				transition: transform 0.3s ease-in-out 0s;
				border-radius: 4px;
				border:#c7c7c7 6rpx solid;
				font-size: 200rpx;
				background-color:#F1F1F188;
				text-align: center;
				vertical-align:middle;
				line-height: 100%;
				padding-top:40%;
				p{
					background: linear-gradient(to bottom, #a2e689, #d3e3ce);
					-webkit-background-clip: text;
					color: transparent;
					// 转变为行内块元素 文字渐变才会生效
					display: inline-block;
				}
				&.le-active {
					transform: scale(.9);
				}
			}
		
		}
	}
	
</style>