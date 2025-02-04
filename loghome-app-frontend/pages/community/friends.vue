<template>
	<view class="outer">
		<lgd-tab class="tab" :firstTab="firstTab" :tabValue="tabValue" @getIndex ="changeTab" textColor="#2d2d2d" ref="tabs"/>
		<view class="list fans" v-show="curTabIndex == 1">
			<p class="fansNums">共有 {{fans.length}} 个粉丝</p>
			<div class="users" v-for="item in fans">
				<navigator class="users" :url="'../users/personalPage?id='+item.user_id">
					<log-image :src="item.avatar_url" alt=""
					onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
					<div class="personInfo">
						<div class="name">{{item.name}}</div>
						<div class="motto">{{item.motto}}</div>
					</div>
				</navigator>
				<followBtn class="button" :targetId="item.user_id"></followBtn>
			</div>
		</view>
		<view class="list fans" v-show="curTabIndex == 0">
			
				<div class="users" v-for="item in follows">
					<navigator class="users" :url="'../users/personalPage?id='+item.follow_id">
						<log-image :src="item.avatar_url" alt=""
						onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
						<div class="personInfo">
							<div class="name">{{item.name}}</div>
							<div class="motto">{{item.motto}}</div>
						</div>
					</navigator>
					<followBtn class="button" :targetId="item.follow_id"></followBtn>
				</div>
			
		</view>
	</view>
</template>

<script>
	import followBtn from '../../components/follow.vue'
	import axios from 'axios'
	export default{
		components:{
			followBtn
		},
		data(){
			return{
				tabValue:[
					"我的关注","我的粉丝"
				],
				id:-1,
				user:{},
				isMe:false,
				curTabIndex:0,
				follows:[],
				fans:[],
				firstTab:0
			}
		},
		onLoad(params){
			//获取该页面模式，没有id为自己的信息，有id为查看他人信息
			if(params.id != undefined){
				this.id = params.id;
				let _this = this;
				axios.get(this.$baseUrl + '/users/user_profile_of?id=' + this.id, {}).then((res) => {
					_this.user = JSON.parse(JSON.stringify(res.data))[0];
					this.tabValue=["Ta的关注","Ta的粉丝"];
					uni.setNavigationBarTitle({
						title:_this.user.name + "的好友"
					})
					//复检是不是本人
					let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
					if(tk != null){
						//验活
						axios.get( _this.$baseUrl + '/users/userprofile', {
							headers: { 
								 'Content-Type': 'application/json',//设置请求头请求格式为JSON
								 'Authorization': tk //设置token 其中K名要和后端协调好
							}
						}).then((res) => {
							let data = JSON.parse(JSON.stringify(res.data));
							if(_this.id != -1 && _this.id == data.user_id) {
								_this.tabValue=["我的关注","我的粉丝"];
								uni.setNavigationBarTitle({
									title:"我的好友"
								})
								_this.isMe = true;
							}
							
						}).catch(function(error) {
							if(error.message == "Request failed with status code 401"){
							}
						})
					}
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
			} else {
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				if(tk != null){
					//验活
					axios.get( _this.$baseUrl + '/users/userprofile', {
						headers: { 
							 'Content-Type': 'application/json',//设置请求头请求格式为JSON
							 'Authorization': tk //设置token 其中K名要和后端协调好
						}
					}).then((res) => {
						let data = JSON.parse(JSON.stringify(res.data));
						if(_this.id != -1 && _this.id == data.user_id) {
							_this.tabValue=["我的关注","我的粉丝"];
							uni.setNavigationBarTitle({
								title:"我的好友"
							})
							_this.isMe = true;
						}
						_this.id = data.user_id;
						
					}).catch(function(error) {
						if(error.message == "Request failed with status code 401"){
						}
					})
				}else {
					
				}
			}
			
			let _this = this;
			let tempInterval = setInterval(function(){
				// console.log(_this.id)
				if(_this.id == -1) return;
				axios.get(_this.$baseUrl + '/community/get_fans_of?id=' + _this.id, {}).then((res) => {
					_this.fans = JSON.parse(JSON.stringify(res.data));
					clearInterval(tempInterval)
					// console.log(_this.fans);
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				axios.get(_this.$baseUrl + '/community/get_follows_of?id=' + _this.id, {}).then((res) => {
					_this.follows = JSON.parse(JSON.stringify(res.data));
					clearInterval(tempInterval)
					// console.log(_this.follows);
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
			},200)
			
			
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
				if(index == 1){
					this.refreshFans();
				} else {
					this.refreshFollows();
				}
			},
			refreshFans(){
				let _this = this;
				if(this.id == -1) return;
				axios.get(_this.$baseUrl + '/community/get_fans_of?id=' + _this.id, {}).then((res) => {
					_this.fans = JSON.parse(JSON.stringify(res.data));
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
			},
			refreshFollows(){
				let _this = this;
				if(this.id == -1) return;
				axios.get(_this.$baseUrl + '/community/get_follows_of?id=' + _this.id, {}).then((res) => {
					_this.follows = JSON.parse(JSON.stringify(res.data));
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.outer{
		background-color: #ffffff;
		padding-top: 4px;
		.tab{
			height: 40px;
			width: 100vw;
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
			color:rgb(180, 111, 88);
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
