<template>
	<view class="outer">
		<div class="description">
			<div style=" background-color:#ffffff; padding:50rpx; font-size: 35rpx;" data-new-gr-c-s-check-loaded="14.1001.0" data-gr-ext-installed=""><p>
				<strong>关于阅读器：</strong>
			</p>
			<p style="text-indent:2em;">
				原木社区为您提供了两种阅读器模式，一种为常规的文本流阅读器（经典），另一种为分页阅读器（全新），您可以根据自己的需要选择合适的阅读器。
			</p>
			<p style="text-indent:2em;">
				如果你后续需要切换阅读器模式，请前往我的->设置->阅读器设置页面。
			</p>
			</div>
		</div>
		<div class="list-content">
			<view class="list">
				<view class="li " @click="readerSet">
					<view class="text">状态：{{readerProps == "page" ? "分页阅读器" : readerProps == "text" ? "文本流阅读器" : "点击设置"}}</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
			</view>
		</div>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				readerProps:"text",
			}
		},
		onLoad(){
			this.refreshProp();
		},
		methods:{
			refreshProp(){
				this.readerProps = window.localStorage.getItem("readerProps");
			},
			readerSet(){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['文本流阅读器',"分页阅读器"],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							window.localStorage.setItem("readerProps","text");
						}
						if(res.tapIndex == 1) {
							window.localStorage.setItem("readerProps","page");
						}
						_this.refreshProp();
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.text{
		font-size: 30rpx;
		width: 100%;
	}		
	
	.list-content{
		background: #fff;
		margin-top:20upx;
	}
	.list{
		width:100%;
		border-bottom:15upx solid  rgb(255, 248, 234);
		background: #fff;
		&:last-child{
			border: none;
		}
		.li{
			width:92%;
			height:100upx;
			padding:0 4%;
			border-bottom:1px solid rgb(255, 248, 234);
			display:flex;
			align-items:center;
		&.noborder{
			border-bottom:0
			}
			.icon{
				flex-shrink:0;
				width:50upx;
				height:50upx;
				image{
					width:50upx;
					height:50upx;
				}
			}
			.text{
				padding-left:20upx;
				width:100%;
				color:#666;
			}
			.to{
				flex-shrink:0;
				width:40upx;
				height:40upx;
			}
		}
	}
</style>
