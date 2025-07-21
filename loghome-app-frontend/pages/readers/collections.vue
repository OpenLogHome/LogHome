<template>
	<transition name="fade" class="transition">
		<div class="outer" v-dark v-if="showList">
				<div v-for="item in books" :key="item.novel_id">
					<navigator :url="'./bookInfo?id=' +  item.novel_id"
							   open-type="navigate">    
						<div class="books">
							<log-image :src="item.picUrl" alt=""
							:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
							<div class="bookInfo">
								<div class="title">{{item.name}}</div>
								<view class="author">
									<log-image :src="item.avatar_url" alt="" class="auther_avatar"
									onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
									<div class="auther_name">{{item.user_name}}</div>
								</view>
								<div class="description">{{item.content}}</div>
							</div>
						</div>
					</navigator>
				</div>
		</div>
	</transition>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				title:"",
				books:[],
				showList:false
			}
		},
		onLoad(params){
			if(!params.title){
				this.title = "人气最佳"
			} else {
				this.title = params.title;
			}
			uni.setNavigationBarTitle({
				title:this.title
			})
			this.refreshCollections();
		},
		onShow(){
			uni.showLoading({
				title: '努力加载中'
			});
			this.refreshCollections();
		},
		methods:{
			refreshCollections(){
				let _this = this;
				axios.get(_this.$baseUrl + '/library/recommand/get_library_recommend_titles?title='+this.title+"&page=1&amount=100", {}).then((res) => {
					_this.books = res.data;
					console.log(_this.books);
					this.showList = true;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		background-color: #f2f2f2;
		
		&.dark-mode {
			background-color: #1E1E1E;
		}
		
		.books {
			height: 260rpx;
			width: calc(100vw - 40rpx);
			margin:20rpx;
			display: flex;
			background-color:rgb(255,255,255);
			border-radius:10rpx;
			
			img {
				height: 260rpx;
				width: 200rpx;
				border-radius: 10rpx 0 0 10rpx;
				margin:0rpx;
				flex-shrink: 0;
			}
			.bookInfo {
				margin-left:30rpx;
				margin-top: 22rpx;
				.title{
					font-size: 34rpx;
					height:42rpx;
					margin-bottom: 10rpx;
					overflow: hidden;
					display: -webkit-box;
					font-weight:bold;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					color:rgb(45,45,45);
					margin:5rpx;
				}
				.author{
					position:relative;
					margin-top:15rpx;
					margin-bottom:10rpx;
					width:40vw;
					.auther_avatar{
						position:absolute;
						top:0rpx;
						left:5rpx;
						height:35rpx;
						width:35rpx;
						border-radius: 5rpx;
		
					}
					.auther_name{
						font-size: 25rpx;
						// font-weight: bold;
						color:rgb(45,45,45);
						margin-left:45rpx;
						overflow:hidden;
						display:-webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
				}
				
				.description{
					font-size: 25rpx;
					color:rgb(142,130,109);
					margin:5rpx;
					margin-right:10rpx;
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
				}
			}
		}
	}
	
	.dark-mode {
		.books {
			background-color: #2C2C2C;
			
			.bookInfo {
				.title {
					color: #FFFFFF;
				}
				
				.author {
					.auther_name {
						color: #CCCCCC;
					}
				}
				
				.description {
					color: #A0A0A0;
				}
			}
		}
	}
	
	.fade-enter-active, .fade-leave-active {
	  transition: all .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	  opacity: 0;
	}
</style>
