<template>
	<view>
		<view style="background-color: #ffffff;">
			<uni-drawer ref="receiver_select" :width="500">
				<scroll-view class="drawer_inner" scroll-y="true">
					<button v-for="user in users" @click="getReceiver(user)" class="user_select_button">
						<image class="user_avatar" :src="user.avatar_url"></image>
						<text style="margin-left:10rpx;">{{user.name}}</text>
					</button>
				</scroll-view>
			</uni-drawer>
			<button class="fake-input" @click="showDrawer">{{receiver.name}}</button>
			<input class="mail_title" placeholder="标题" maxlength="20" v-model="title"/>
			<textarea class="mail_content" placeholder="信件内容"  v-model="content"></textarea>
			<button @click="post_mail" class="normal_button" v-show="!sended">发送信息</button>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				users: [],
				receiver:{name:"选择收件人",id:-1},
				title:"",
				content:"",
				sended:false
			}
		},
		onLoad(){
			this.getFriends();
		},
		methods: {
			showDrawer() {
				this.$refs.receiver_select.open();
			},
			closeDrawer() {
				this.$refs.receiver_select.close();
			},
			getReceiver(user){
				this.receiver = user;
				this.closeDrawer();
			},
			getFriends(){
				let tk = JSON.parse(window.localStorage.getItem('token'));
				let id = -1;
				if(tk){
					id = tk.id;
					tk = tk.tk;
				}
				let _this = this;
				axios.get(_this.$baseUrl + '/community/get_friends_of?id=' + id, {}).then((res) => {
					_this.users = res.data;
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
			},
			post_mail(){
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				//console.log(tk);
				axios.post(this.$baseUrl + '/community/send_mail',
					{
						to_id: this.receiver.id,
						title: this.title,
						msg:this.content
					},
					{
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					},
				)
				.then(function(response) {
					uni.showToast({
						title: "发送成功",
						icon: 'none',
						duration: 2000
					});
					_this.sended = true;
					setTimeout(()=>{
						uni.navigateBack({
						});
					},1000)
				})
				.catch(function(error) {
					if (error) {
						uni.showToast({
							title: "发送失败",
							icon: 'none',
							duration: 2000
						});
					}
				});
			}
		}
	}
</script>


<style scoped lang="less">
	.mail_title{
		width: 696rpx;
		margin: 20rpx auto;
		border: #cacaca 1rpx solid;
		padding: 0 12rpx;
		font-size: 18px;
		height: 30px;
		border-radius: 5px;
	}
	.mail_content{
		width: 696rpx;
		margin: 20rpx auto;
		border: #CACACA 1rpx solid;
		padding: 4px 12rpx;
		font-size: 18px;
		height: 36vh;
		border-radius: 5px;
	}
	.drawer_inner{
		background-color: #ffffff;
	}
	
	.normal_button {
		height: 40px;
		width: 80%;
		margin-top: 30px;
		font-size: 16px;
		font-family: "微软雅黑";
		font-weight: bold;
		line-height: 38px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(180, 111, 88);
		text-align: center;
	}
	.fake-input{
		width: 720rpx;
		margin: 20rpx auto;
		border: #cacaca 1rpx solid;
		padding: 0 12rpx;
		font-size: 18px;
		height: 34px;
		background-color: rgba(0, 0, 0, 0);
		color: #808080;
		text-align: left;
		font-size: 16px;
	}
	.user_select_button{
		background-color: rgba(0,0,0,0);
		height: 48px;
		display: flex;
		justify-content: row;
		padding-top: 4px;
		color: #713418;
		.user_avatar{
			height: 40px;
			width: 40px;
			display: inline-block;
			border-radius: 4px;
		}
	}
</style>
