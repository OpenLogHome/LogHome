<template>
	<view class="content"
	v-dark>
		<div class="searchBar" v-dark>
			<div class="search-input-wrapper" @tap="navigateToSearch">
				<uni-icons type="search" size="18" color="#999"></uni-icons>
				<view class="search-input-placeholder">搜索书籍、圈子、帖子、用户</view>
			</div>
			<uni-icons type="chat" size="26" :color="$store.state.isDarkMode ? '#e5e5e5' : '#2d2d2d'" class="messageIcon" @click="gotoMessage"></uni-icons>
		</div>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" style="margin-top: 105rpx;"
			@down="downCallback" @up="upCallback" :fixed="false" :height="'100%'">
			<div class="swiper" v-show="keyword.length == 0" v-dark>
				<Xsuu-swiper :swiperItems="newchartList" :margin="18" 
				:borderRadius="10" @clicked="roulousChartClicked"
				class="swiperImgs">
				</Xsuu-swiper>
				<div class="swiperNav" v-dark>
					<div class="navBtn">
						<img src="../static/swiperNavIcons/category.png" alt="标签" @click="navBarJump('标签')"/>
						<div class="name">标签</div>
					</div>
 					<div class="navBtn">
						<img src="../static/swiperNavIcons/activity.png" alt="活动" @click="navBarJump('活动')"/>
						<div class="name">活动</div>
					</div>
 					<div class="navBtn">
						<img src="../static/swiperNavIcons/ranks.png" alt="排行" @click="navBarJump('排行')"/>
						<div class="name">排行</div>
					</div>
					<div class="navBtn">
						<img src="../static/swiperNavIcons/recommands.png" alt="推荐" @click="navBarJump('推荐')"/>
						<div class="name">推荐</div>
					</div>
					<div class="navBtn">
						<img src="../static/swiperNavIcons/finish.png" alt="完结" @click="navBarJump('完结')"/>
						<div class="name">完结</div>
					</div>
				</div>
			</div>
			
			
			<div class="card" v-for="(item,index) in collections" v-show="keyword.length == 0" v-dark>
				<div class="head" @click="gotoCollections(item.collection_title)">
					<div class="title">
						<p>
							{{item.collection_title}}
						</p>
						<div class="lightLine" v-dark></div>
						<log-image :src="item.icon" alt="" class="icon" v-show="item.icon!=''"/>
					</div>
					<div class="more" >
						<uni-icons type="right" size="20" :color="$store.state.isDarkMode ? '#b8b8b8' : 'rgb(142,130,109)'"></uni-icons>
					</div>
				</div>
				
				<div class="novels-slide" v-if="item.collection_type=='slide'" style="min-height: 200rpx;">
					<transition-group name="fade" class="transition" type="in-out">
						<bookInCase v-for="novel in item['novels']" :bookName="novel.name" 
						:picUrl="novel.picUrl" :key="novel.novel_id"
						@click.native="readBook(novel.novel_id)"></bookInCase>
					</transition-group>
				</div>
				<div class="novel-lists" v-else-if="item.collection_type=='cards'" style="min-height: 200rpx;">
					<transition-group name="fade" class="transition" type="in-out">
						<div v-for="novel in item['novels'].slice(0,4)" :key="novel.novel_id">
							<navigator :url="'./readers/bookInfo?id=' +  novel.novel_id"
												   open-type="navigate" class="books" v-dark>
								<log-image :src="novel.picUrl + '?thumbnail=1'" alt=""
								:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`" style="border-radius: 10rpx; transform:scale(.90)"/>
								<div class="bookInfo" style="margin-left:10rpx;">
									<div class="title">
										{{novel.name}}
										<el-tag type="warning" v-show="novel.novel_type == 'world'" effect="dark"
										style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">世界设定</el-tag>
									</div>
									<view class="author">
										<log-image :src="novel.avatar_url" alt="" class="auther_avatar"
										onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
										<div class="auther_name">{{novel.user_name}}</div>
									</view>
									<div class="description">{{novel.content}}</div>
								</div>
							</navigator>
						</div>
					</transition-group>
				</div>
				
				<div class="dense-card-outer-container" v-else-if="item.collection_type=='dense_card'" style="min-height: 200rpx;">
					<div class="dense-card-container">
						<div class="dense-card-scroll">
							<div class="dense-card-column" v-for="col in 3" :key="'col-'+col">
								<div class="dense-card-item" v-for="(novel, index) in item['novels'].slice((col-1)*3, col*3)" :key="novel.novel_id" @click="readBook(novel.novel_id)">
									<div class="dense-card-rank" :class="{'rank-top': (col-1)*3 + index < 3}">{{(col-1)*3 + index + 1}}</div>
									<log-image :src="novel.picUrl + '?thumbnail=1'" alt="" class="dense-card-cover"
									:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
									<div class="dense-card-info">
										<div class="dense-card-title">
											{{novel.name}}
										</div>
										<div class="dense-card-author">{{novel.user_name}}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="dense-card-mask"></div>
				</div>
				
			</div>
			
			<div v-for="item in [...searchBooks,...books]" :key="item.book_id">
				<navigator :url="'./readers/bookInfo?id=' +  item.novel_id"
									   open-type="navigate" class="books" v-dark>
					<log-image :src="item.picUrl + '?thumbnail=1'" alt=""
					:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
					<div class="bookInfo">
						<div class="title">
							{{item.name}}
						</div>
						<view class="author">
							<log-image :src="item.auther_avatar" alt="" class="auther_avatar"
							onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
							<div class="auther_name">{{item.author_name}}</div>
						</view>
						<div class="description">{{item.content}}</div>
					</div>
				</navigator>
			</div>
			
			<div class="underBar"></div>
		</mescroll-body>
	</view>
</template>

<script>	
	import axios from 'axios'
	import bookInCase from '../components/book_in_case.vue'
	import popup from "@/components/ge-popup.vue"
	import XsuuSwiper from "../components/Xss-swiper/Xsuu-swiper.vue"
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default {
		components:{
			bookInCase,popup,XsuuSwiper
		},
		mixins: [MescrollMixin, darkModeMixin], // 使用mixin
		data() {
			return {
				books: [],
				chartList:[],
				newchartList:[],
				collections:[],
				timer:undefined,
				searchBooks:[],
				keyword:"",
				appUpdate:{
					hasUpdate: false,
					version:'1.0',
					desc:'1.更新内容更新内容 <br/> 2.更新内容更新内容 <br/>2.更新内容更新内容',
					update_url:""
				},
			}
		},
		onLoad(){
		},
		onShow() {
		},
		methods: {
			mescrollInit(mescroll){
				this.mescroll = mescroll;
			},
			downCallback(){
				this.mescroll.resetUpScroll();
				this.refreshPage();
				this.checkUpdate();
				this.checkAncientVersion();
				this.refreshRecommends();
				this.books = [];
				// if(window.jsBridge.inApp){
				// 	window.jsBridge.vibrate();
				// }
			},
			upCallback(){
				this.getMoreNovels();
			},
			//刷新页面
			async refreshPage() {
				//刷新轮播图
				let _this = this;
				axios.get(this.$baseUrl + '/library/get_library_roulous_chart', {}).then((res) => {
					this.chartList = res.data;
					_this.newchartList = [];
					for(let item of _this.chartList){
						if(item.isValid == 1){
							_this.newchartList.push({
								img:item.image,
								title:item.title,
								Subtitle:item.name,
								button:(item.navigate_to == "None")?0:1,
								navigate_to:item.navigate_to
							})
						}
					}
					setTimeout(()=>{
						this.mescroll.endSuccess();
					},1000);
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
					console.log(error);
					this.mescroll.endErr();
				}).then(function(){
					
				})
			},
			async getMoreNovels(){
				//获取更多小说
				axios.get(this.$baseUrl + '/library/get_novels_all', {}).then((res) => {
					this.books = [...this.books,...res.data];
					setTimeout(()=>{
						this.mescroll.endSuccess();
					},1000);
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
					this.mescroll.endErr();
				}).then(function(){
					uni.hideLoading();
				})
			},
			//响应轮播图点击事件
			roulousChartClicked(item){
				if(item.navigate_to && item.navigate_to !="None"){
					uni.navigateTo({
						url:item.navigate_to
					})
				}
			},
			//响应进入书籍详情页面事件
			readBook(novel_id) {
				if(novel_id > 0) {
					uni.navigateTo({
						url:'./readers/bookInfo?id=' +  novel_id
					})
				}
			},
			//刷新推荐
			refreshRecommends(){
				// 获取所有推荐集合
				let _this = this;
				axios.get(this.$baseUrl + '/library/recommand/get_library_collections', {}).then((res) => {
					_this.collections = res.data;
					//获取每个推荐集合中的推荐作品
					for(let item of _this.collections){
						_this.$set(item,'novels',[])
						axios.get(_this.$baseUrl
						+ '/library/recommand/get_library_recommend_titles?title='
						+ item.collection_title+"&page=1&amount=10", {}).then((res) => {
							_this.$set(item,'novels',res.data);
						}).catch(function (error) {
							uni.showToast({
								title: error.toString(),
								icon:'none',
								duration: 2000
							});
						}).then(function(){
							
						})
					}
				}).catch(function (error) {
					uni.switchTab({
						url: './bookcase/index'
					})
					uni.showToast({
						title: "离线模式",
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					
				})
			},
			// 跳转到搜索页面
			navigateToSearch() {
				uni.navigateTo({
					url: '/pages/community/search?origin=library'
				});
			},

			// 搜索图书馆 - 保留此函数以防其他地方调用
			searchLibrary(e){
				clearTimeout(this.timer);
				let _this = this;
				this.keyword = e;
				// 这里使用延时节流
				this.timer= setTimeout(()=>{
					axios.get(_this.$baseUrl + '/library/get_novels_search?keyword=' + e, {}).then((res) => {
						_this.searchBooks = res.data;
						if(!isNaN(parseInt(_this.keyword)) && res.data.length != 0){
							_this.books = [];
						}
					}).catch(function (error) {
						uni.showToast({
							title: error.toString(),
							icon:'none',
							duration: 2000
						});
					}).then(function(){
						uni.hideLoading();
					})
				},500)
			},
			//前往推荐集合的详情界面
			gotoCollections(title){
				uni.navigateTo({
					url:'./readers/collections?title=' +  title
				})
			},
			//检查更新
			checkUpdate(){
				let isApp = window.jsBridge && window.jsBridge.inApp;
				if(!isApp) {
					console.log("not in app")
					return;
				}
				let appVersion = this.$store.state.appVersion;
				axios.get(this.$baseUrl + '/app/get_app_update', {}).then((res) => {
					const update = res.data[0];
					// console.error(update.version_number, String(appVersion))
					if(update.version_number > appVersion){
						// 直接跳转到update页面，由update页面自己获取数据
						uni.navigateTo({
							url: '/pages/update'
						});
					}
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			gotoMessage(){
				uni.navigateTo({
					url:"./community/message"
				})
			},
			//通过某些技术手段（如版本特性）检查是否是超远古版本
			checkAncientVersion(){
				//检查是否内测期间的超远古热更新版本
				if(sessionStorage.getItem("appVersion") != undefined){
					uni.navigateTo({
						url:"./apps/badVersion"
					})
				}
			},
			navBarJump(func){
				switch(func){
					case "标签":
						uni.navigateTo({
							url:"./readers/tags"
						})
						break;
					case "活动":
						this.gotoCollections("干草块杯活动专辑");
						break;
					case "排行":
						this.gotoCollections("原木力爆棚");
						break;
					case "推荐":
						this.gotoCollections("原木力飙升");
						break;
					case "完结":
						this.gotoCollections("完本经典");
						break;
				}
			}
		},

	}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-flow: wrap;
		background-color: rgb(242,242,242);
		width:100vw;
		
		&.dark-mode {
			background-color: var(--background-color-secondary);
		}
		
		div.searchBar{
			position:fixed;
			width:calc(100vw - 20rpx);
			z-index:10;
			top:0;
			left:0;
			margin:0 0rpx;
			padding:10rpx;
			padding-top:calc(5rpx + var(--statusBarHeight));
			padding-bottom:5rpx;
			background-color: rgb(255,255,255);
			display:flex;
			align-items: center;
			height: 110rpx;
			box-shadow:
			  0px 0px 2.2px rgba(0, 0, 0, 0.02),
			  0px 0px 5.3px rgba(0, 0, 0, 0.028),
			  0px 0px 10px rgba(0, 0, 0, 0.035),
			  0px 0px 17.9px rgba(0, 0, 0, 0.042),
			  0px 0px 33.4px rgba(0, 0, 0, 0.05),
			  0px 0px 80px rgba(0, 0, 0, 0.07)
			;
			
			&.dark-mode {
				background-color: var(--card-background);
				box-shadow:
				  0px 0px 2.2px rgba(0, 0, 0, 0.1),
				  0px 0px 5.3px rgba(0, 0, 0, 0.13),
				  0px 0px 10px rgba(0, 0, 0, 0.15),
				  0px 0px 17.9px rgba(0, 0, 0, 0.17),
				  0px 0px 33.4px rgba(0, 0, 0, 0.2),
				  0px 0px 80px rgba(0, 0, 0, 0.3)
				;
			}
			
			.messageIcon{
				margin:24rpx 5rpx 20rpx 5rpx;
			}

			.search-input-wrapper {
				flex: 1;
				display: flex;
				align-items: center;
				background-color: #f5f5f5;
				border-radius: 36rpx;
				padding: 0 20rpx;
				height: 72rpx;
				margin-right: 10rpx;
				margin-left: 10rpx;

				.dark-mode & {
					background-color: #333;
				}
			}

			.search-input-placeholder {
				flex: 1;
				height: 72rpx;
				line-height: 72rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
				color: #999;
			}
		}
		
		div.swiper{
			margin:0;
			background-color:white;
			padding:20rpx 0;
			width: 750rpx;
			
			&.dark-mode {
				background-color: var(--card-background);
			}
			
			.swiperImgs{
				position:relative;
				z-index:1;
			}
			.swiperNav{
				position:relative;
				height:200rpx;
				margin:0 9px;
				margin-top:-10rpx;
				width:calc(100% - 18px);
				background:linear-gradient(
					180deg,
					rgb(255, 255, 255),
					rgb(252,233,164),
				);
				z-index:0;
				border-radius: 0 0 10rpx 10rpx;
				box-shadow:
				  0px 0px 2.2px rgba(0, 0, 0, 0.02),
				  0px 0px 5.3px rgba(0, 0, 0, 0.028),
				  0px 0px 10px rgba(0, 0, 0, 0.035),
				  0px 0px 17.9px rgba(0, 0, 0, 0.042),
				  0px 0px 33.4px rgba(0, 0, 0, 0.05),
				  0px 0px 80px rgba(0, 0, 0, 0.07)
				;
				display:flex;
				align-items: center;
				justify-content: space-around;
				
				&.dark-mode {
					background:linear-gradient(
						180deg,
						var(--card-background),
						rgb(80, 70, 40),
					);
					box-shadow:
					  0px 0px 2.2px rgba(0, 0, 0, 0.1),
					  0px 0px 5.3px rgba(0, 0, 0, 0.13),
					  0px 0px 10px rgba(0, 0, 0, 0.15),
					  0px 0px 17.9px rgba(0, 0, 0, 0.17),
					  0px 0px 33.4px rgba(0, 0, 0, 0.2),
					  0px 0px 80px rgba(0, 0, 0, 0.3)
					;
				}
				
				.navBtn{
					transform: translate(0,10rpx);
					img{
						height:100rpx;
						filter: drop-shadow(0px 2px 10rpx #17181944);
					}
					div.name{
						text-align: center;
						color:rgb(45,45,45);
						font-size: 25rpx;
						margin-top:5rpx;
						
						.dark-mode & {
							color: var(--text-color-primary);
						}
					}
				}
			}
		}
		div.card{
			margin:20rpx 0rpx;
			padding:0 0 0rpx 0;
			box-sizing: border-box;
			background-color:rgb(255,255,255);
			
			&.dark-mode {
				background-color: var(--card-background);
			}
			
			.head{
				margin:0rpx 25rpx;
				padding: 30rpx 0 20rpx 0;
				height:45rpx;
				div.title{
					float:left;
					font-size: 35rpx;
					font-weight: bold;
					color:rgb(45,45,45);
					margin:0 0 20rpx 0;
					height:45rpx;
					position:relative;
					
					.dark-mode & {
						color: var(--text-color-primary);
					}
					
					p{
						position:relative;
						z-index:1;
					}
					.lightLine{
						width:100%;
						height:30rpx;
						background-color:rgb(161,255,127);
						border-radius: 20rpx;
						position:relative;
						top:-30rpx;
						z-index:0;
						&.dark-mode {
							background-color:rgb(57, 88, 46);
						}
					}
					img.icon{
						height:65rpx;
						border-radius: 20rpx;
						position:absolute;
						top:-5rpx;
						right:-65rpx;
						z-index:0;
						filter: drop-shadow(0px 2px 10rpx #17181944);
					}
				}
				div.more{
					float:right;
					display:flex;
					margin-top: 5rpx;
					p{
						color:rgb(142,130,109);
						font-size: 30rpx;
						line-height: 44rpx;
						height:44rpx;
						
						.dark-mode & {
							color: var(--text-color-regular);
						}
					}
					.moreImg{
						height:30rpx;
						width:30rpx;
						margin-right: 8rpx;
					}
				}
			}
			div.novels-slide{
				.transition{
					width:100vw;
					display:flex;
					flex-direction: row;
					overflow: auto;
					font-size:30rpx;
					height:370rpx;
					overflow-y: hidden;
				}
			}
			div.novels-slide::-webkit-scrollbar {
				display: none;
			}
			div.novel-cards{
				.transition{
					width:100vw;
					display:flex;
					flex-direction: row;
					justify-content: center;
					flex-flow: wrap;
					overflow: auto;
					font-size:30rpx;
				}
			}
		}
		.books {
			height: 260rpx;
			width: calc(100vw - 40rpx);
			margin:20rpx;
			display: flex;
			background-color:rgb(255,255,255);
			border-radius:10rpx;
			
			&.dark-mode {
				background-color: #252525 !important;
			}
			
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
					
					.dark-mode & {
						color: var(--text-color-primary);
					}
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
						overflow:hidden;
						margin-left:45rpx;
						display:-webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						
						.dark-mode & {
							color: var(--text-color-primary);
						}
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
					
					.dark-mode & {
						color: var(--text-color-regular);
					}
				}
			}
		}
		div.underBar{
			height: 150rpx;
		}
		
		.changeButton{
			margin:0 60rpx 20rpx 60rpx;
			background-color: #f0e4cd;
			color:#713418;
			height:80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size:30rpx;
			border-radius:10rpx;
			transition:all .3s;
			
			.dark-mode & {
				background-color: #3a362d;
				color: #d1a980;
			}
		}
		
		.changeButton:active{
			background-color: #d1c7b3;
			transform:scale(.9,.9);
			
			.dark-mode & {
				background-color: #4c4639;
			}
		}
	}
	
	.theme-switch-button {
		position: fixed;
		bottom: 120rpx;
		right: 30rpx;
		z-index: 999;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
	}
	
	.fade-enter-active, .fade-leave-active {
	  transition: all .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	  opacity: 1;
	}
	.list-complete-item {
	  transition: all 1s;
	  display: inline-block;
	  margin-right: 10px;
	}
	.list-complete-enter, .list-complete-leave-to
	/* .list-complete-leave-active for below version 2.1.8 */ {
	  opacity: 1;
	  transform: translateY(30px);
	}
	.list-complete-leave-active {
	  position: absolute;
	}
	
	.popup{
		height:100vh;
	}
	
	.dense-card-outer-container {
		position: relative;
		width: 100%;
		min-height: 200rpx;
		overflow: hidden;
	}
	
	.dense-card-container {
		width: 100%;
		overflow-x: auto;
		padding: 10rpx 0 10rpx 0;
	}
	
	.dense-card-mask {
		position: absolute;
		top: 0;
		right: 0;
		width: 150rpx;
		height: 100%;
		background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
		pointer-events: none;
		z-index: 2;
		
		.dark-mode & {
			background: linear-gradient(to left, var(--card-background), rgba(37, 37, 37, 0));
		}
	}
	
	.dense-card-scroll {
		display: flex;
		overflow-x: auto;
		width: fit-content;
		padding: 10rpx 10rpx;
	}
	
	.dense-card-column {
		display: flex;
		flex-direction: column;
		margin-right: 20rpx;
		
		&:first-child {
			margin-left: 20rpx;
		}
	}
	
	.dense-card-item {
		display: flex;
		width: 340rpx;
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		align-items: center;
		position: relative;
		
		.dense-card-rank {
			position: absolute;
			left: 10rpx;
			top: 0;
			width: 40rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			font-size: 28rpx;
			color: #ffffff;
			font-weight: bold;
			background-color: #999999;
			border-radius: 5rpx;
			margin-right: 15rpx;
		}
		
		.rank-top {
			background: linear-gradient(135deg, #FF6B00, #FFAE00);
			box-shadow: 0 2px 4px rgba(255, 107, 0, 0.3);
		}
		
		.dense-card-cover {
			width: 105rpx;
			height: 140rpx;
			border-radius: 8rpx;
			flex-shrink: 0;
			margin-left: 10rpx;
		}
		
		.dense-card-info {
			flex: 1;
			margin-left: 20rpx;
			overflow: hidden;
			
			.dense-card-title {
				height: 92rpx;
				font-size: 32rpx;
				color: rgb(45, 45, 45);
				font-weight: bold;
				margin-bottom: 10rpx;
				width: 100%;
				overflow: hidden;
				display: -webkit-box;
				font-weight:bold;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-overflow: ellipsis;
				
				.dark-mode & {
					color: var(--text-color-primary);
				}
			}
			
			.dense-card-author {
				font-size: 28rpx;
				color: rgb(142, 130, 109);
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				
				.dark-mode & {
					color: var(--text-color-regular);
				}
			}
		}
	}
	
	.dense-card-container::-webkit-scrollbar {
		display: none;
	}
</style>
