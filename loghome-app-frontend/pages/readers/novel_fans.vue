<template>
	<view class="outer">
		<!-- <view class="top">
			<view class="chooseList" v-for="(item,index) in topTitle" :key="index" @click="changeList(index)"
					:style="{borderBottom:(index == isActive ? 'rgb(243,181,35) solid 3rpx': '.5rpx solid rgba(33, 33, 18, 0.1)'),
							 color:(index == isActive ? 'rgb(243,181,35)': 'rgb(126, 126, 126)')}">
				{{item}}
			</view>
		</view> -->
		<view class="fansList">
			<view class="fanMod" v-for="(fan,index) in fanInfo" :key="index">
				<view class="rank">
					<view :class="index > 2 ? '' : rank2class[index]">
						{{index + 1}}
					</view>
				</view>
				<view class="ownPic">
					<navigator :url="'../users/personalPage?id=' + fan.user_id">
						<image :src="fan.avatar_url" style="height: 100rpx;width: 100rpx;border-radius: 50%;"></image>
					</navigator>
				</view>
				<view class="rightMod">
					<view class="rightTop" style="position: relative;width: 100%;">
						<view style="font-size:30rpx;font-weight: bold;color:rgb(243, 175, 56);
									 right:2vw; position: absolute;"
						>{{fan.fans_value}}</view>
						<span style="font-size:30rpx;font-weight: bold;color: rgb(61, 176, 208);margin-right:2vw;">{{fan.user_name}}</span>
					</view>
					<view class="leaveMessage">
						<span>此书只应天上有，当赏当赏！</span> 
					</view>
				</view>
			</view>
			<view class="blank_box"></view>
		</view>
		<view class="myInfoTitle">
			{{myInfo.rank}}
		</view>
		<view class="myInfo">
			<view class="ownPic">
				<image :src="myInfo.avatar_url" style="height: 100rpx;width: 100rpx;border-radius: 50%;"></image>
			</view>
			<view class="rightTop" style="position: relative;width: 75vw;">
				<view style="font-size:30rpx;font-weight: bold;color:rgb(243, 175, 56);
							 right:2vw; position: absolute;"
				>{{myInfo.fans_value}}</view>
				<span style="font-size:30rpx;font-weight: bold;color: rgb(61, 176, 208);margin-right:2vw;">{{myInfo.name}}</span>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				topTitle:['周榜','总榜'],
				isActive:0,
				fanInfo:[
				],
				myInfo:{
					rank:"未上榜",
					fans_value:0
				},
				rank2class:['numOne','numTwo','numThree'],
				uid:0,
			}
		},
		methods:{
			changeList(index){
				this.isActive = index;
			},
			getStatistics(){
				axios.get(this.$baseUrl + "/library/get_all_novel_fans?novel_id=" + this.uid)
				.then((res)=>{
					this.fanInfo = res.data;
					this.getMyInfo();
				}).catch(err=>{
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				})
			},
			getMyInfo(){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				if(tk == null){
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
					return;
				}
				//验活
				axios.get( this.$baseUrl + '/users/userprofile', {
					headers: { 
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					_this.myInfo = {
						..._this.myInfo,
						...JSON.parse(JSON.stringify(res.data))
					};
					for(let i = 0 ; i < _this.fanInfo.length; i ++){
						if(_this.fanInfo[i].user_id == _this.myInfo.user_id){
							_this.myInfo.rank = `第 ${i + 1} 名`;
							_this.myInfo.fans_value = _this.fanInfo[i].fans_value;
						}
					}
				}).catch(function(error) {
					if(error.message == "Request failed with status code 401"){
						window.localStorage.removeItem('token');
						this.$isFromLogin = true;
						uni.navigateTo({
							url: './users/login?msg=' + 'unAuthorized'
						});
					}
				})
			}
		},
		onLoad(params){
			this.uid = params.id;
			this.getStatistics();
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		width: 100vw;
		display: flex;
		flex-wrap: wrap;
		overflow:auto;
		position: relative;
		.top{
			width: 100vw;
			display: flex;
			font-size: 30rpx;
			font-weight: bold;
			.chooseList{
				height:100rpx;
				width: 50vw;
				display: flex;
				justify-content: center;
				align-items: center;
				transition: .5s;
			}
		}
		.numOne{
			color: #ffffff ;
			display: flex;
			justify-content: center;
			align-items: center;
			background-image: url(../../static/redstart.png);
			background-size:100% 100%;
			height: 50rpx;
			width: 50rpx;
			padding-top: 5rpx;
		}
		.numTwo{
			color: #ffffff ;
			display: flex;
			justify-content: center;
			align-items: center;
			background-image: url(../../static/yellowstar.png);
			background-size:100% 100%;
			height: 50rpx;
			width: 50rpx;
			padding-top: 5rpx;
		}
		.numThree{
			color: #ffffff ;
			display: flex;
			justify-content: center;
			align-items: center;
			background-image: url(../../static/yellowstar.png);		
			background-size:100% 100%;
			height: 50rpx;
			width: 50rpx;
			padding-top: 5rpx;
		}
		.ownPic{
			height: 100%;
			width: 18vw;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 3vw;
		}
		.myInfoTitle{
			position: fixed;
			bottom: 120rpx;
			width: 25vw;
			height: 60rpx;
			margin:0;
			padding:0;
			border:0;
			background-color: rgba(0,0,0,.73);
			border-top-right-radius: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:30rpx;
			padding-right: 5vw;
			color: rgb(195,195,195);
		}
		.rank{
			height: 100%;
			width: 10vw;
			padding-left: 3vw;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			color: rgb(52,52,52);
			font-weight: bold;
		}
		.myInfo{
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			height: 120rpx;
			margin:0;
			padding:0;
			border:0;
			background-color: rgba(0,0,0,.73);
			display: flex;
			align-items: center;
			
		}
		.fansList{
			width: 100%;
			height: 100vh;
			.fanMod{
				display: flex;
				height: 200rpx;
				border-bottom: 2rpx solid rgba(202, 201, 163, 0.4);
				width: 100vw;
				.rightMod{
					display: flex;
					flex-wrap: wrap;
					width: 65vw;
					height: 200rpx;
					align-items: center;
					.rightTop{
						display: flex;
						align-items: center;
						margin-bottom: -2vh;
					}
				}
				
				.leaveMessage{
					width: 85%;
					height: 80rpx;
					background-color: rgba(216, 221, 223,.6);
					border-radius: 14rpx;
					color: rgb(114,155,172);
					font-weight: bold;
					font-size: 30rpx;
					display: flex;
					align-items: center;
					padding: 0 10rpx;
					position: relative;
				}
				.leaveMessage:before{
					content: "";
					width: 0;
					height: 0;
					border-left: 30rpx solid transparent;
					border-right: 30rpx solid transparent;
					border-top: 30rpx solid rgb(232,232,228);
					position: absolute;
					top: 0rpx;
					left: -10rpx;
				}
				
			}
		}
	}
	.blank_box{
		height:calc(125rpx + 100rpx);
	}
</style>
