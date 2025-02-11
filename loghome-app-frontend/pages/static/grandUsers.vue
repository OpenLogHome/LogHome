<template>
	<view class="outer">
		<lgd-tab class="tab" :firstTab="firstTab" :tabValue="tabValue" @getIndex ="changeTab" textColor="black" ref="tabs"/>
		<view class="list fans" v-show="curTabIndex == 1">
			<div class="users" v-for="item in greatUsers">
				<navigator class="users" :url="'../users/personalPage?id='+item.user_id">
					<log-image :src="item.avatar_url" alt=""
					onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
					<div class="personInfo">
						<div class="name">{{item.name}}</div>
						<div class="motto">{{item.great_info}}</div>
					</div>
				</navigator>
				<followBtn class="button" :targetId="item.user_id"></followBtn>
			</div>
		</view>
		<view class="list fans" v-show="curTabIndex == 0">
			
				<div class="users" v-for="item in grandUsers">
					<navigator class="users" :url="'../users/personalPage?id='+item.user_id">
						<log-image :src="item.avatar_url" alt=""
						onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
						<div class="personInfo">
							<div class="name">{{item.name}}</div>
							<div class="motto">
								<groupLabel v-for="user_group in item.user_group.split(',')" :userGroup="user_group"></groupLabel>
							</div>
						</div>
					</navigator>
					<followBtn class="button" :targetId="item.user_id"></followBtn>
				</div>
			
		</view>
	</view>
</template>

<script>
	import followBtn from '../../components/follow.vue'
	import groupLabel from "../usergroup/groupLabel.vue"
	import axios from 'axios'
	export default{
		components:{
			followBtn, groupLabel
		},
		data(){
			return{
				tabValue:[
					"内/公测参与用户","重大贡献用户"
				],
				id:-1,
				user:{},
				isMe:false,
				curTabIndex:0,
				grandUsers:[],
				greatUsers:[],
				firstTab:0
			}
		},
		onLoad(params){
			let _this = this;
			// console.log(_this.id)
			axios.get(_this.$baseUrl + '/app/get_grand_users', {}).then((res) => {
				_this.grandUsers = JSON.parse(JSON.stringify(res.data));
			}).catch(function(error) {
				uni.showToast({
					title: "用户信息加载失败",
					icon: 'none',
					duration: 2000
				})
			})
			axios.get(_this.$baseUrl + '/app/get_great_users', {}).then((res) => {
				_this.greatUsers = JSON.parse(JSON.stringify(res.data));
			}).catch(function(error) {
				uni.showToast({
					title: "用户信息加载失败",
					icon: 'none',
					duration: 2000
				})
			})
			
			
			if(params.tab){
				this.firstTab = params.tab
			}
			
			
		},
		mounted(){
			this.$refs.tabs.clickTab(this.firstTab);
		},
		methods:{
			changeTab(index){ 
				this.curTabIndex = index;
			}
		}
	}
</script>

<style scoped lang="less">
	.outer{
		background-color:#FFFFFF;
		.tab{
			height:80rpx;
			width:100vw;
		}
		.list.fans{
			p.fansNums{
				height:50rpx;
				padding-left:20rpx;
				font-size: 30rpx;
				color:rgb(48, 48, 48);
				border-bottom: #cacaca 1rpx solid;
			}
		}
	}
	
	.users {
		height: 130rpx;
		width: 100vw;
		border-bottom: #cacaca 1rpx solid;
		display: flex;
		position:relative;
		img {
			height: 100rpx;
			border:#cacaca 1rpx solid;
			border-radius: 7rpx;
			margin:15rpx;
		}
		.name {
			margin-top: 20rpx;
			font-size: 32rpx;
			height:40rpx;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			color:rgb(113, 52, 24);
		}
		.motto{
			color:rgb(97, 97, 97);
			width:58vw;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			margin-top: 8rpx;
			font-size: 28rpx;
		}
		.button{
			position:absolute;
			right:30rpx;
			top:50%;
			transform: translateY(-50%);
		}
	}
</style>
