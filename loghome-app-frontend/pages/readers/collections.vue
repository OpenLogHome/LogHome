<template>
	<transition name="fade" class="transition">
		<div class="outer" v-dark v-if="showList || isLoading">
			<div class="collectionsSkeleton" v-if="isLoading" aria-label="书籍列表加载中">
				<div class="bookSkeleton" v-for="index in 5" :key="index">
					<div class="skeletonBlock skeletonCover"></div>
					<div class="skeletonInfo">
						<div class="skeletonBlock skeletonTitle" :class="`skeletonWidth${index % 3}`"></div>
						<div class="skeletonAuthor">
							<div class="skeletonBlock skeletonAvatar"></div>
							<div class="skeletonBlock skeletonAuthorName"></div>
						</div>
						<div class="skeletonBlock skeletonDescription"></div>
						<div class="skeletonBlock skeletonDescription short"></div>
					</div>
				</div>
			</div>
			<div class="collectionList" v-else>
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
				showList:false,
				isLoading:true,
				loadingRequestCount:0
			}
		},
		onLoad(params){
			if(!params.title){
				this.title = "人气最佳"
			} else {
				this.title = params.title;
			}
			
			// 如果是原木力爆棚，直接跳转到新榜单页面
			if (this.title === '原木力爆棚') {
				this.isLoading = false;
				uni.redirectTo({
					url: '/pages/readers/rankBoard?board=logpower&zone=all&noneAnimation=1'
				});
				return;
			}

			uni.setNavigationBarTitle({
				title:this.title
			})
			this.refreshCollections();
		},
		onShow(){
			if (this.title === '原木力爆棚') return;
			this.refreshCollections();
		},
		methods:{
			refreshCollections(){
				let _this = this;
				this.loadingRequestCount += 1;
				this.isLoading = true;
				axios.get(_this.$baseUrl + '/library/recommand/get_library_recommend_titles?title='+encodeURIComponent(this.title)+"&page=1&amount=100", {}).then((res) => {
					_this.books = res.data;
					console.log(_this.books);
					this.showList = true;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(() => {
					this.loadingRequestCount = Math.max(0, this.loadingRequestCount - 1);
					this.isLoading = this.loadingRequestCount > 0;
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

		.collectionsSkeleton {
			width: 100%;
			padding: 1rpx 0;
		}

		.bookSkeleton {
			height: 260rpx;
			width: calc(100vw - 40rpx);
			margin: 20rpx;
			display: flex;
			background-color: #ffffff;
			border-radius: 10rpx;
			overflow: hidden;
			box-sizing: border-box;
		}

		.skeletonBlock {
			position: relative;
			overflow: hidden;
			border-radius: 7rpx;
			background-color: #e8e8e8;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: -100%;
				width: 100%;
				height: 100%;
				background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
				animation: collections-skeleton-shimmer 1.4s ease-in-out infinite;
			}
		}

		.skeletonCover {
			width: 200rpx;
			height: 260rpx;
			border-radius: 0;
			flex-shrink: 0;
		}

		.skeletonInfo {
			flex: 1;
			padding: 27rpx 35rpx 20rpx 30rpx;
			min-width: 0;
		}

		.skeletonTitle {
			width: 65%;
			height: 34rpx;
		}

		.skeletonWidth0 { width: 52%; }
		.skeletonWidth1 { width: 78%; }

		.skeletonAuthor {
			display: flex;
			align-items: center;
			margin-top: 23rpx;
			margin-bottom: 22rpx;
		}

		.skeletonAvatar {
			width: 35rpx;
			height: 35rpx;
			border-radius: 5rpx;
			flex-shrink: 0;
		}

		.skeletonAuthorName {
			width: 145rpx;
			height: 22rpx;
			margin-left: 10rpx;
		}

		.skeletonDescription {
			width: 92%;
			height: 22rpx;
			margin-top: 13rpx;

			&.short {
				width: 68%;
			}
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

	@keyframes collections-skeleton-shimmer {
		100% {
			left: 100%;
		}
	}
	
	.dark-mode {
		.bookSkeleton {
			background-color: #2C2C2C;
		}

		.skeletonBlock {
			background-color: #444444;

			&::after {
				background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
			}
		}

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
