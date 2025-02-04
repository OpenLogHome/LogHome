<template>
	<view class="content-top">
		<swiper @change="swiperChange" :style="{height:height+'rpx'}" circular="true" autoplay="true" interval="8000" 
		:previous-margin="previousMargin" :next-margin="nextMargin">
			<swiper-item v-for="(item,index) in swiperItems" :key="index" @click="clicked(item)">
				<view class="content"
					:style="{height:height+'rpx',marginLeft:margin+'rpx',marginRight:margin+'rpx',borderRadius:borderRadius+'rpx'}">
					<log-image :src="item.img" mode="aspectFill" class="swiper-img"></log-image>
					<view class="mask"></view>
					<view class="written">
						<text v-if="item.title" class="Text-initialization overflow" :style="{fontSize: titleFontSize+'rpx',color:titleColor}"
							:class="[index === enjoySiwper ? 'title' : '']">
							{{item.title}}
						</text>
						<text v-if="item.Subtitle" class="Text-initialization overflow" :style="{fontSize: SubtitleFontSize+'rpx',color:SubtitleColor}"
							:class="[index === enjoySiwper ? 'Subtitle' : '']">
							{{item.Subtitle}}
						</text>
						<view class="Text-initialization" v-if="item.button == undefined || item.button == 1" :class="[index === enjoySiwper ? 'bt' : '']">
							<text class="bt-ico">查看详情 ➜</text>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view v-if="DotPosition === 1">
			<view class="dot" :style="{top:(height-30-dotHeight)+'rpx',left:(margin+30+dotMargin)+'rpx'}">
				<view v-for="(item,index) in swiperItems" :key="index" :style="{backgroundColor:SelectBG}"
					:class="[index === enjoySiwper ? 'Select ' : 'Unchecked']"></view>
			</view>
			<view class="dot" :style="{top:(height-30-dotHeight)+'rpx',left:(margin+30+dotMargin)+'rpx'}">
				<view v-for="(item,index) in swiperItems" :key="index" :style="{backgroundColor:UncheckedBG}"
					:class="[index === enjoySiwper ? 'Select1 ' : 'Unchecked1']"></view>
			</view>
		</view>
		<view v-if="DotPosition === 2">
			<view class="dot" :style="{top:(height-30-dotHeight)+'rpx',right:(margin+30+dotMargin)+'rpx'}">
				<view v-for="(item,index) in swiperItems" :key="index" :style="{backgroundColor:SelectBG}"
					:class="[index === enjoySiwper ? 'Select ' : 'Unchecked']"></view>
			</view>
			<view class="dot" :style="{top:(height-30-dotHeight)+'rpx',right:(margin+30+dotMargin)+'rpx'}">
				<view v-for="(item,index) in swiperItems" :key="index" :style="{backgroundColor:UncheckedBG}"
					:class="[index === enjoySiwper ? 'Select1 ' : 'Unchecked1']"></view>
			</view>
		</view>
		<view v-if="DotPosition === 3">
			<view class="dot-c" :style="{top:(height-30-dotHeight)+'rpx'}">
				<view v-for="(item,index) in swiperItems" :key="index" :style="{backgroundColor:SelectBG}"
					:class="[index === enjoySiwper ? 'Select ' : 'Unchecked']"></view>
			</view>
			<view class="dot-c" :style="{top:(height-30-dotHeight)+'rpx'}">
				<view v-for="(item,index) in swiperItems" :key="index" :style="{backgroundColor:UncheckedBG}"
					:class="[index === enjoySiwper ? 'Select1 ' : 'Unchecked1']"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			
			
			// swiperItems  循环对象
			// height  高度
			// margin  边距
			// borderRadius 圆角
			// titleFontSize 标题大小
			// titleColor 标题颜色
			// SubtitleFontSize 副标题大小
			// SubtitleColor 副标题颜色
			// dotHeight 指示点距离轮播底部高度
			// dotMargin 指示点侧边距
			// SelectBG 指示点未选中颜色
			// UncheckedBG 指示点选中颜色
			// DotPosition 指示点位置 1左侧 2右侧 3居中
			// button 查看详情按钮是否显示 1显示 0不显示
			// previousMargin 前边距，可用于露出前一项的一小部分
			// nextMargin 后边距，可用于露出后一项的一小部分
			
			
			previousMargin: {
				type: String,
				default: "0rpx"
			},
			nextMargin: {
				type: String,
				default: "0rpx"
			},
			swiperItems: {
				type: Array,
				default: function() {
					return new Array();
				}
			},
			height: {
				type: Number,
				default: 260
			},
			margin: {
				type: Number,
				default: 30
			},
			borderRadius: {
				type: Number,
				default: 20
			},
			titleFontSize: {
				type: Number,
				default: 36
			},
			titleColor:{
				type: String,
				default: "#ffffff"
			},
			SubtitleFontSize: {
				type: Number,
				default: 24
			},
			SubtitleColor:{
				type: String,
				default: "#ffffff"
			},
			dotMargin: {
				type: Number,
				default: 0
			},
			dotHeight: {
				type: Number,
				default: 0
			},
			SelectBG: {
				type: String,
				default: "rgba(255, 255, 255, 0.5)"
			},
			UncheckedBG: {
				type: String,
				default: "rgba(255, 255, 255, 1)"
			},
			DotPosition: {
				type: Number,
				default: 1
			},
			button:{
				type: Number,
				default: 1
			}

		},

		data() {
			return {
				enjoySiwper: 0
			}
		},
		methods: {
			swiperChange: function(e) {
				this.enjoySiwper = e.detail.current;
			},
			clicked(item){
				this.$emit("clicked",item);
			}
		}
	}
</script>

<style>
	.content-top{
		position: relative;
		margin-top:20rpx;
	}
	.content {
		overflow: hidden !important;
		position: relative;
	}

	.mask {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0rpx;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.5)0%, rgba(67, 72, 92, 0)100%);
		z-index: 1;
	}

	.swiper-img {
		width: 100%;
	}

	.written {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: absolute;
		top: 25%;
		left: 30rpx;
		z-index: 2;
	}


	.Text-initialization {
		opacity: 0;
	}

	.title {
		font-weight: bold;
		width: 60%;
		animation: textAnimation 0.8s 0.3s forwards;
	}

	.Subtitle {
		width: 70%;
		animation: textAnimation 0.8s 0.5s forwards;
	}

	.overflow {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.bt {
		margin-top: 20rpx;
		animation: textAnimation 0.8s 0.7s forwards;
	}

	.bt-ico {
		color: #FFFFFF;
		border: #FFFFFF solid 1px;
		border-radius: 0rpx;
		font-size: 24rpx;
		padding: 4rpx 10rpx;
		background-color: rgb(0,0,0,0.3);
	}

	@keyframes textAnimation {
		0% {
			opacity: 0;
			transform: translateX(-80rpx);
		}
		
		100% {
			opacity: 1;
		}
	}

	.dot {
		position: absolute;
		display: flex;
	}

	.Select {
		height: 6rpx;
		width: 10rpx;
		border-radius: 0rpx;
		margin-left: 10rpx;
		animation: Select 1s 0s 1 forwards;
	}

	.Unchecked {
		height: 6rpx;
		width: 10rpx;
		margin-left: 10rpx;
		border-radius: 0rpx;
	}

	@keyframes Select {
		to {
			height: 6rpx;
			width: 60rpx;
		}
	}

	.Select1 {
		height: 6rpx;
		width: 10rpx;
		border-radius: 0rpx;
		margin-left: 10rpx;
		animation: Select1 7s 0s 1 forwards;
		background-color: rgba(255, 255, 255, 1);
	}

	.Unchecked1 {
		height: 6rpx;
		width: 10rpx;
		margin-left: 10rpx;
		border-radius: 0rpx;
		background-color: rgba(255, 255, 255, 0) !important;
	}

	@keyframes Select1 {
		from {
			height: 6rpx;
			width: 10rpx;
		}

		to {
			height: 6rpx;
			width: 60rpx;
		}
	}

	.dot-c {
		position: absolute;
		width: 100%;
		flex: 1;
		display: flex;
		justify-content: center;
	}
</style>
