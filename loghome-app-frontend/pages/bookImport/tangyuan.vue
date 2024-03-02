<template>
	<div class="outer">
		<div class="info">由于汤圆创作即将于2月28日停止服务，为了方便文社成员转移作品，我们支持将汤圆作品一键导入到原木社区。</div>
		<div class="login" v-if="!isLogin" >
			<div class="longin-boder">
				<div class="image"><img src="../../static/icons/icon_my_user.png" class="icon"></div>
				<input class="input" type="text" placeholder="输入汤圆手机号" v-model="account"/>
			</div> 
			<!--End用户名输入框-->
			<div class="longin-boder">
				<div class="image"><img src="../../static/icons/icon_my_password.png" class="icon"></div>
				<input class="input" type="password" placeholder="输入汤圆密码" v-model="pwd"/>
			</div>
			<!--End密码输入框-->
			<div class="button" @click="login">登录</div>
		</div>
		<div class="accountInfo" v-if="isLogin" >
			<span>已登录汤圆账户：</span>
			<span>{{tangyuanUser.nickname}}</span>
			<p>请选择你想要导入的书籍：</p>
		</div>
		<div class="books" v-if="isLogin">
			<div class="book" v-for="book in booksData" @click="importBook(book.id,book.name,book.summary)">
				<div class="bookInfo">
					<div class="title">{{book.name}}</div>
					<div class="description">{{book.summary}}</div>
				</div>
			</div>
		</div>
		<div class="button" @click="logout"  v-if="isLogin">退出账号</div>
		<div class="info" style="color:#5f5f61">
			<p>说明：</p>
			<p>1.本助手只提供作品文本导入功能，作品图片和作者有话说部分如果需要存留请自行前往汤圆APP保存。</p>
			<p>2.本助手提供的导入功能不能保证信息和排版与原作品完全一致，在导入完成后我们建议你手动检查是否存在遗漏章节。</p>
			<p>3.本助手仅供非商业用途，提供的服务与汤圆创作官方无关。</p>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				account:"",
				pwd:"",
				isLogin:false,
				tangyuanUser:{},
				booksData:{}
			}
		},
		onLoad(){
			//检查是否已经在登录状态，如果在的话则自动登入。
			let _this = this;
			uni.showLoading({});
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
			axios.get(this.$baseUrl + '/tangyuanExport/checkImportStatus',
			{
				headers: {
				     'Content-Type': 'application/json',//设置请求头请求格式为JSON
				     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
				}
				
			}
			).then((res) => {
				console.log(res);
				if(res.data.length > 0){
					_this.isLogin = true;
					_this.tangyuanUser = res.data[0];
					_this.refreshBooks();
				}
				this.$forceUpdate();
			}).catch(function (error) {
				uni.showToast({
					title: "获取汤圆账户信息失败",
					icon:'none',
					duration: 2000
				});
			}).then(function(){
				uni.hideLoading();
			})
		},
		methods:{
			login(){
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.post(this.$baseUrl + '/tangyuanExport/loginitangyuan',
				{
						account: this.account,
						password: this.pwd
				}, 
				{
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
					
				}
				).then((res) => {
					if(res.data.msg == "OK"){
						_this.tangyuanUser = res.data.data;
						_this.isLogin = true;
						_this.refreshBooks();
					} else {
						uni.showToast({
							title: "登录失败，请检查账号和密码是否正确。",
							icon:'none',
							duration: 2000
						});
					}
					this.$forceUpdate();
				}).catch(function (error) {
					uni.showToast({
						title: "登录出错。",
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			refreshBooks(){
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
				axios.get(this.$baseUrl + '/tangyuanExport/getallBooks',
				{
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
					
				}
				).then((res) => {
					console.log(res);
					if(res.data.msg == "OK"){
						_this.booksData = res.data.data.books;
						_this.isLogin = true;
					} else {
						uni.showToast({
							title: "获取书籍信息失败",
							icon:'none',
							duration: 2000
						});
					}
					this.$forceUpdate();
				}).catch(function (error) {
					uni.showToast({
						title: "获取书籍信息出错。",
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			importBook(id,name,summary){
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '你确定要导入《' + name + '》吗？',
					confirmColor:"#EA7034",
					success: function (res) {
						if (res.confirm) {
							let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
							
							axios.post(_this.$baseUrl + '/essays/add_Novel',
							{
								name:name,
								content:summary + "(该小说导入自汤圆创作)"
							},
							{
								headers: {
									'Content-Type': 'application/json', //设置请求头请求格式为JSON
									'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
								}
							},
							)
							.then(function(response) {
								axios.get(_this.$baseUrl + '/tangyuanExport/importBook?book_id=' + response.data.insertId + "&ty_id=" + id,
								{
									headers: {
									     'Content-Type': 'application/json',//设置请求头请求格式为JSON
									     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
									}
								}
								).then((res) => {
									uni.showModal({
										title: '导入提示',
										content: '后台已开始自动导入书籍。导入可能需要一段时间，请不要重复导入相同书籍。\n导入结束后系统会向你发送通知。',
										confirmColor:"#EA7034",
										showCancel:false,
										success: function (res) {
											uni.reLaunch({
												url: '../essays',
											})
										}
									})
								}).catch(function (error) {
									uni.showToast({
										title: "导入失败",
										icon:'none',
										duration: 2000
									});
								}).then(function(){
									uni.hideLoading();
								})
							})
							.catch(function(error) {
								//console.log(error);
								if (error) {
									uni.showToast({
										title: "导入失败",
										icon: 'none',
										duration: 2000
									});
								}
							})
							
						}
					}
				});
			},
			logout(){
				this.isLogin = false;
				this.tangyuanUser = undefined;
			}
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		background-color:rgb(255, 248, 234);
		.info, .accountInfo{
			padding:10px;
			font-size: 15px;
		}
		.login{
			.longin-boder{
				width: 80%;
				height: 40px;
				margin-top: 30px;
				margin-left: 10%;
				line-height: 40px;
				text-align: center;
				border: 1px solid #dddddd;
				border-radius: 5px;  
				background-color: #efefef;
			}
			img.icon{
				width:70rpx;
			}
			.image{
				width: 50rpx;
				float: left;
				text-align: right;
			}
			.input{
				width: 80%;
				float: left;
				margin-left: 5%;
				height: 37px;
				line-height: 37px;
				border:0px;
				color: #333333;
				font-size: 16px;
				background-color: #efefef;
				
			}
			 

		}
		.book{
			height: 200rpx;
			width: 100vw;
			border-bottom: #cacaca 1rpx solid;
			display: flex;
			.bookInfo {
				margin-left:15rpx;
				margin-top: 22rpx;
				.title{
					font-size: 35rpx;
					height:42rpx;
					margin-bottom: 10rpx;
					overflow: hidden;
					font-weight: bold;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					color:rgb(113, 52, 24);
					margin:5rpx;
				}
				
				.description{
					font-size: 25rpx;
					color:rgb(157, 157, 157);
					height:100rpx;
					margin:5rpx;
					margin-right:40rpx;
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
				}
			}
		}
	}
	
	.button{
		height: 40px;
		width: 80%;
		margin-top: 30px;
		margin-left: 10%;
		text-align:center;
		font-size: 16px;
		font-weight: bold;
		line-height: 38px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(234,112,52);
		
	}
	 
	.button:active {  
		background-color:rgb(234, 171, 11);
	}
</style>
