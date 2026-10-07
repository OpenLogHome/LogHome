<template>
	<div class="outer" v-dark>
		<view class="avator" @click="gotoAvater">
			<user-avatar :src="user.avatar_url" :frame="user.avatar_frame" :animate="true" />
		</view>
		<view class="avatar-actions">
			<view class="avatar-action" @click="gotoAvater">{{ $t('settings.userInfo.changeAvatar') }}</view>
			<view class="avatar-action avatar-action--frame" @click="gotoAvatarFrames">{{ $t('settings.userInfo.chooseFrame') }}</view>
		</view>
		<el-input
		  type="text"
		  :placeholder="$t('settings.userInfo.penNamePlaceholder')"
		  v-model="username"
		  maxlength="20"
		  show-word-limit
		>
		</el-input>
		<div style="margin: 20rpx 0;"></div>
		<el-input
		  type="textarea"
		  :placeholder="$t('settings.userInfo.mottoPlaceholder')"
		  v-model="motto"
		  :rows="4"
		  :autosize="{ minRows: 4}"
		  maxlength="30"
		  show-word-limit
		>
		</el-input>
		<div class="button" @click="submit">{{ $t('common.submit') }}</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default{
		data() {
			return{
				username:"",
				motto:"",
				user:{},
				buttonLock : true,
				id:0
			}
		},
		onShow() {
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			if(tk == null){
				uni.navigateTo({
					url: './users/login?msg=' + 'unAuthorized'
				});
				return;
			}
			//验活
			axios.get( this.$baseUrl + '/users/userprofile', {
				headers: {
				     'Content-Type': 'application/json',
				     'Authorization': tk
				}
			}).then((res) => {
				_this.user = JSON.parse(JSON.stringify(res.data));
				_this.username = _this.user.name;
				_this.motto = _this.user.motto;
			}).catch(function(error) {
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './login'
					});
				}
			})
		},
		methods:{
			gotoAvater(){
				uni.navigateTo({
					url:"./avater_upload?noneAnimation=true&url=" + this.user.avatar_url
				})
			},
			gotoAvatarFrames(){
				uni.navigateTo({
					url:"./avatar_frames"
				})
			},
			submit(){
				if(this.username.replace(/(^\s*)|(\s*$)/g, "") == "" || this.motto.replace(/(^\s*)|(\s*$)/g, "") == "")
				{
					uni.showToast({
						title: this.$t('settings.userInfo.requiredMissing'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if(!this.buttonLock) return;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				this.buttonLock = false;
				axios.post(this.$baseUrl + '/users/update_userinfo',
						{
							name:this.username,
							motto:this.motto
						},
						{
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + tk
							}
						},
					)
					.then(function(response) {
						uni.showToast({
							title: _this.$t('settings.userInfo.updateSuccess'),
							icon: 'none',
							duration: 2000
						});
						setTimeout(()=>{
							uni.reLaunch({
								url: '../me',
							})
						},2000)
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
								title: _this.$t('settings.userInfo.updateFailed'),
								icon: 'none',
								duration: 2000
							});
						}
					})
					.then(function(){
						_this.buttonLock = true;
					});
			}
		}
	}
</script>

<style scoped lang="less">
	.outer{
		display:flex;
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;
		min-height: calc(100vh - var(--window-top, 0px) - var(--window-bottom, 0px));
		box-sizing: border-box;
		padding: 30px;
		background-color: #ffffff;
		.avator{
			margin-top:10rpx;
			width: 210upx;
			height: 210upx;
			background: transparent;
			overflow: visible;
		}
		.avatar-actions {
			display: flex;
			gap: 18rpx;
			margin: 22rpx 0 52rpx;
		}
		.avatar-action {
			padding: 13rpx 24rpx;
			border: 1rpx solid rgba(180, 111, 88, .35);
			border-radius: 999rpx;
			font-size: 24rpx;
			color: #9c5f4b;
			background: var(--card-background);
		}
		.avatar-action--frame {
			color: #fff;
			background: rgb(180, 111, 88);
		}
		.input {
			width: 100%;
			height: 37px;
			line-height: 37px;
			border: 0px;
			color: var(--text-color-primary);
			font-size: 16px;
			background-color: var(--card-background);
			margin-bottom: 20px;
			border-radius: 5px;
			padding-left:10px;
		}
		.textarea{
			width: 100%;
			height: 100px;
			line-height: 37px;
			border: 0px;
			color: var(--text-color-primary);
			font-size: 16px;
			background-color: var(--card-background);
			padding-left:10px;
		}
	}

	.button {
		height: 40px;
		width: 80%;
		margin-top: 30px;
		font-size: 16px;

		font-weight: bold;
		line-height: 38px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(180, 111, 88);
		text-align: center;
	}

	.button:active {
		background-color: rgb(225, 139, 110);
	}

</style>
