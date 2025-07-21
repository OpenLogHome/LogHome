<template>
	<view class="outer">
		<view class="page-header">
			<text class="page-title">粉丝排行榜</text>
		</view>
		<view class="top">
			<view class="chooseList" v-for="(item,index) in topTitle" :key="index" @click="changeList(index)"
				:class="{'active': index === isActive}">
				{{item}}
			</view>
		</view>
		<view class="content-wrapper">
			<view class="fansList" v-if="fanInfo && fanInfo.length > 0">
				<view class="fanMod" v-for="(fan,index) in fanInfo" :key="index" :class="{'top-three': index < 3}">
					<view class="rank">
						<view :class="index > 2 ? 'rank-normal' : rank2class[index]">
							{{index + 1}}
						</view>
					</view>
					<view class="ownPic">
						<navigator :url="'../users/personalPage?id=' + fan.user_id">
							<log-image :src="fan.avatar_url" class="avatar-image"></log-image>
						</navigator>
					</view>
					<view class="rightMod">
						<view class="rightTop">
							<text class="username">{{fan.user_name}}</text>
							<text class="fans-value">{{fan.fans_value}}</text>
						</view>
						<view class="leaveMessage" @click="editMessage(fan)" v-if="fan.user_id !== myInfo.user_id">
							<span>{{fan.message || '此书只应天上有，当赏当赏！'}}</span>
						</view>
						<view class="leaveMessage editable" v-else @click="editMessage(fan)">
							<span>{{fan.message || '此书只应天上有，当赏当赏！'}}</span>
							<view class="edit-icon">✎</view>
						</view>
					</view>
				</view>
				<view class="blank_box"></view>
			</view>
			<view class="empty-state" v-else>
				<view class="empty-icon">📊</view>
				<view class="empty-text">{{ isActive === 0 ? '本月暂无粉丝数据' : '暂无粉丝数据' }}</view>
				<view class="empty-subtext">成为第一个打赏的粉丝吧！</view>
			</view>
		</view>
		<view class="myInfoTitle">
			{{myInfo.rank}}
		</view>
		<view class="myInfo">
			<view class="ownPic">
				<log-image :src="myInfo.avatar_url" class="avatar-image"></log-image>
			</view>
			<view class="rightTop my-info-right">
				<text class="username">{{myInfo.name}}</text>
				<text class="fans-value">{{myInfo.fans_value}}</text>
			</view>
		</view>
		
		<!-- 编辑留言弹窗 -->
		<uni-popup ref="messagePopup" type="dialog">
			<uni-popup-dialog mode="input" title="编辑留言" :value="editingMessage" 
				placeholder="请输入留言内容" @confirm="confirmEditMessage">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				topTitle:['月榜','总榜'],
				isActive:0,
				fanInfo:[],
				myInfo:{
					rank:"未上榜",
					fans_value:0
				},
				rank2class:['numOne','numTwo','numThree'],
				uid:0,
				editingMessage: '',
				currentEditingFan: null
			}
		},
		methods:{
			changeList(index){
				this.isActive = index;
				this.getStatistics();
			},
			getStatistics(){
				let listType = this.isActive === 0 ? 'month' : 'total';
				axios.get(this.$baseUrl + "/library/get_all_novel_fans?novel_id=" + this.uid + "&type=" + listType)
				.then((res)=>{
					this.fanInfo = res.data;
					this.getMyInfo();
				}).catch(err=>{
					uni.showToast({
						title: err.toString(),
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
			},
			editMessage(fan) {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(!tk) {
					uni.showToast({
						title: '请先登录',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				// 如果不是自己的留言，不允许编辑
				if(fan.user_id !== this.myInfo.user_id) {
					return;
				}
				
				this.currentEditingFan = fan;
				this.editingMessage = fan.message || '此书只应天上有，当赏当赏！';
				this.$refs.messagePopup.open();
			},
			confirmEditMessage(value) {
				if(!this.currentEditingFan) return;
				
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(tk) tk = tk.tk;
				
				axios.post(this.$baseUrl + "/library/update_fan_message", {
					novel_id: this.uid,
					message: value
				}, {
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': tk
					}
				}).then((res) => {
					if(res.data.success) {
						// 更新本地数据
						for(let i = 0; i < this.fanInfo.length; i++) {
							if(this.fanInfo[i].user_id === this.myInfo.user_id) {
								this.fanInfo[i].message = value;
								break;
							}
						}
						
						uni.showToast({
							title: '留言已更新',
							icon: 'success',
							duration: 2000
						});
					}
				}).catch(err => {
					uni.showToast({
						title: '更新留言失败',
						icon: 'none',
						duration: 2000
					});
				});
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
		flex-direction: column;
		position: relative;
		background-color: #faf8f6;
		min-height: calc(100vh - 44px); // 减去导航栏高度
		box-sizing: border-box;
		
		.page-header {
			width: 100%;
			padding: 30rpx 40rpx;
			background: linear-gradient(135deg, #ff9800, #e65100);
			color: #fff;
			box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			
			.page-title {
				font-size: 36rpx;
				font-weight: bold;
			}
		}
		
		.top {
			width: 100%;
			display: flex;
			background-color: #fff;
			box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
			height: 80rpx;
			box-sizing: border-box;
			
			.chooseList {
				height: 80rpx;
				width: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				color: #795548;
				font-weight: bold;
				position: relative;
				transition: all 0.3s ease;
				
				&.active {
					color: #ff9800;
					
					&:after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 25%;
						width: 50%;
						height: 6rpx;
						background-color: #ff9800;
						border-radius: 6rpx 6rpx 0 0;
					}
				}
			}
		}
		
		.content-wrapper {
			flex: 1;
			display: flex;
			flex-direction: column;
			width: 100%;
			
			.empty-state {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding: 40rpx;
				min-height: 400rpx;
				
				.empty-icon {
					font-size: 80rpx;
					margin-bottom: 20rpx;
				}
				
				.empty-text {
					font-size: 32rpx;
					color: #795548;
					font-weight: bold;
					margin-bottom: 10rpx;
				}
				
				.empty-subtext {
					font-size: 28rpx;
					color: #a1887f;
				}
			}
		}
		
		.avatar-image {
			height: 100rpx;
			width: 100rpx;
			border-radius: 50%;
			box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
			border: 3rpx solid #fff;
		}
		
		.numOne, .numTwo, .numThree {
			color: #ffffff;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60rpx;
			width: 60rpx;
			border-radius: 50%;
			font-size: 28rpx;
			font-weight: bold;
			box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.15);
		}
		
		.numOne {
			background: linear-gradient(135deg, #ff9800, #ff5722);
		}
		
		.numTwo {
			background: linear-gradient(135deg, #a1887f, #795548);
		}
		
		.numThree {
			background: linear-gradient(135deg, #8d6e63, #5d4037);
		}
		
		.rank-normal {
			color: #5d4037;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50rpx;
			width: 50rpx;
			border-radius: 50%;
			font-size: 28rpx;
			font-weight: bold;
			background: #fff0e1;
		}
		
		.ownPic{
			height: 100%;
			min-width: 120rpx;
			max-width: 15vw;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 3vw;
		}
		
		.myInfoTitle{
			position: fixed;
			bottom: 120rpx;
			width: auto;
			padding: 10rpx 30rpx;
			height: 60rpx;
			margin: 0;
			border: 0;
			background-color: rgba(93,64,55,0.9);
			border-top-right-radius: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: #fff0e1;
			z-index: 100;
		}
		
		.rank{
			height: 100%;
			width: 70rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.myInfo{
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			height: 120rpx;
			margin: 0;
			padding: 0;
			border: 0;
			background: linear-gradient(90deg, rgba(121,85,72,0.95), rgba(93,64,55,0.95));
			display: flex;
			align-items: center;
			box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.1);
			z-index: 99;
			box-sizing: border-box;
		}
		
		.fansList{
			width: 100%;
			padding: 20rpx;
			box-sizing: border-box;
			
			.fanMod{
				display: flex;
				height: auto;
				padding: 30rpx 10rpx;
				border-bottom: 2rpx solid rgba(0,0,0,0.05);
				width: 100%;
				margin: 15rpx 0;
				background-color: #fff;
				border-radius: 15rpx;
				box-shadow: 0 2rpx 15rpx rgba(0,0,0,0.05);
				transition: all 0.3s ease;
				box-sizing: border-box;
				
				&.top-three {
					background: linear-gradient(180deg, #fff, #fff8e1);
					border-left: 8rpx solid #ff9800;
				}
				
				&:hover, &:active {
					transform: translateY(-2rpx);
					box-shadow: 0 5rpx 20rpx rgba(0,0,0,0.08);
				}
				
				.rightMod{
					display: flex;
					flex-direction: column;
					flex: 1;
					width: auto;
					justify-content: center;
					overflow: hidden;
					
					.rightTop{
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						margin-bottom: 15rpx;
						
						.username {
							font-size: 30rpx;
							font-weight: bold;
							color: #795548;
							margin-right: 2vw;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							max-width: 65%;
						}
						
						.fans-value {
							font-size: 30rpx;
							font-weight: bold;
							color: #ff7043;
							margin-right: 20rpx;
						}
					}
				}
				
				.leaveMessage{
					width: 85%;
					padding: 15rpx 20rpx;
					background-color: #fff8e1;
					border-radius: 12rpx;
					color: #795548;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					position: relative;
					box-sizing: border-box;
					word-break: break-word;
					
					&:before {
						content: "";
						width: 0;
						height: 0;
						border-left: 15rpx solid transparent;
						border-right: 15rpx solid transparent;
						border-bottom: 15rpx solid #fff8e1;
						position: absolute;
						top: -10rpx;
						left: 20rpx;
					}
					
					&.editable {
						border: 1px dashed rgba(255, 152, 0, 0.4);
						display: flex;
						justify-content: space-between;
						align-items: center;
						
						.edit-icon {
							margin-left: 10rpx;
							font-size: 24rpx;
							color: #ff9800;
							background-color: rgba(255, 152, 0, 0.1);
							width: 40rpx;
							height: 40rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							border-radius: 50%;
						}
					}
				}
			}
		}
		
		.my-info-right {
			width: 75vw;
			padding-right: 20rpx;
			position: relative;
			
			.username {
				font-size: 30rpx;
				font-weight: bold;
				color: #fff;
				margin-right: 2vw;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 65%;
			}
			
			.fans-value {
				font-size: 30rpx;
				font-weight: bold;
				color: #ffcc80;
				position: absolute;
				right: 40rpx;
			}
		}
	}
	
	.blank_box{
		height: calc(125rpx + 100rpx);
	}
</style>
