<template>
	<view class="outer" v-show="id != targetId">
		<div class="btn not" v-show="status == -1" @click.prevent="follow($event)">
			<uni-icons color="#ffffff" :type="'spinner-cycle'" size="15"></uni-icons>
		</div>
		<div class="btn not" v-show="status == 0" @click.prevent="follow($event)">
			<uni-icons color="#ffffff" :type="'personadd'" size="15"></uni-icons>
			关注
		</div>
		<div class="btn" v-show="status == 1" @click.prevent="unfollow($event)">
			<uni-icons color="#929292" :type="'checkmarkempty'" size="15"></uni-icons>
			已关注
		</div>
		<div class="btn" v-show="status == 2" @click.prevent="unfollow($event)">
			<uni-icons color="#929292" :type="'staff'" size="15"></uni-icons>
			已互关
		</div>
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				id:-1,
				status:-1
			}
		},
		props:{
			targetId:{
				type:Number,
				default:-1
			}
		},
		mounted(){
			let _this = this;
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if(tk != undefined){
				//验活
				_this.id = tk.id;
				_this.refreshStatus();
			}
			this.$bus.$on("followUpdate", () => {
				// console.log("AutoSave");
				this.refreshStatus();
			})
		},
		destroyed(){
			this.$bus.$off("followUpdate");
		},
		methods:{
			refreshStatus(){
				let _this = this;
				if(this.id == -1) return;
				axios.get(_this.$baseUrl + '/community/follow_status?user_id=' + _this.id + '&target_id=' + _this.targetId, {}).then((res) => {
					_this.status = res.data.status;
				}).catch(function(error) {
				})
			},
			follow(e){
				e.stopPropagation();
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.post(this.$baseUrl + '/community/follow',
					{
						follow_id: _this.targetId
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
						title: "已关注",
						icon: 'none',
						duration: 2000
					});
					_this.$bus.$emit("followUpdate");
					_this.refreshStatus();
				})
				.catch(function(error) {
					console.log(error);
					if (error) {
						uni.showToast({
							title: "关注失败",
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			unfollow(e){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['取消关注'],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							e.stopPropagation();
							let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
							axios.post(_this.$baseUrl + '/community/unfollow',
								{
									follow_id: _this.targetId
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
									title: "已取消关注",
									icon: 'none',
									duration: 2000
								});
								_this.$bus.$emit("followUpdate");
								_this.refreshStatus();
							})
							.catch(function(error) {
								console.log(error);
								if (error) {
									uni.showToast({
										title: "取消失败",
										icon: 'none',
										duration: 2000
									});
								}
							});
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			}
		}
	}
</script>

<style scoped>
	.btn {
		height: 60rpx;
		width: 150rpx;
		padding-top: 2px;
		padding-bottom: 2px;
		font-size: 14px;
		text-align: center;
		line-height: 30px;
		border-radius: 5px;
		color: #929292;
		background-color: #f2f2f2;
	}
	
	.btn.not{
		height: 60rpx;
		width: 150rpx;
		padding-top: 2px;
		padding-bottom: 2px;
		font-size: 14px;
		text-align: center;
		line-height: 30px;
		border-radius: 5px;
		color: #ffffff;
		background-color: #929292;
	}
</style>
